
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../../api";

const getToken = () =>
  localStorage.getItem("userToken") ||
  localStorage.getItem("adminToken");
  
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const checkAccess = async (bookData) => {
    if (bookData.accessType === "free") {
      setHasAccess(true);
      return;
    }

    const token = getToken();

    if (!token) {
      setHasAccess(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/payments/access/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHasAccess(response.data.hasAccess === true);
    } catch (error) {
      console.error("Book access check failed:", error);
      setHasAccess(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchBook = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/books/${id}`);

        if (!active) return;

        setBook(response.data);
        await checkAccess(response.data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBook();

    return () => {
      active = false;
    };
  }, [id]);

  
const openBook = async () => {
  const token = getToken();

  if (book.accessType === "premium" && !token) {
    alert("Please log in to read your purchased book.");
    navigate("/login");
    return;
  }

  // Open the tab immediately to avoid browser popup blocking.
  const newTab = window.open("about:blank", "_blank");

  if (!newTab) {
    alert("Please allow pop-ups for this website to read your book.");
    return;
  }

  newTab.opener = null;

  try {
    newTab.document.title = "Loading your book...";

    const response = await axios.get(
      `${API_URL}/api/books/${id}/read`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
        responseType: "blob",
      }
    );

    // Verify that the response contains a PDF.
    const contentType = response.headers["content-type"] || "";

    if (
      !contentType.toLowerCase().includes("application/pdf") &&
      !response.data.type?.toLowerCase().includes("application/pdf")
    ) {
      const errorText = await response.data.text().catch(() => "");

      throw new Error(
        errorText || "The server did not return a valid PDF file."
      );
    }

    const pdfUrl = URL.createObjectURL(response.data);

    // Display the PDF in the already-opened tab.
    newTab.location.href = pdfUrl;

    // Release the temporary URL when the tab is closed.
    const cleanup = () => URL.revokeObjectURL(pdfUrl);

    newTab.addEventListener("pagehide", cleanup, { once: true });
  } catch (error) {
    console.error("Read API URL:", `${API_URL}/api/books/${id}/read`);
console.error("HTTP status:", error.response?.status);
console.error("Backend response:", error.response?.data);
console.error("Book contentUrl:", book?.contentUrl);

    if (!newTab.closed) {
      newTab.close();
    }

    if (error.response?.status === 401) {
      alert("Your session has expired. Please log in again.");
      navigate("/login");
    } else if (error.response?.status === 403) {
      alert("You need to purchase this book before reading it.");
      setHasAccess(false);
    } else {
      const message =
        error.message ||
        error.response?.data?.message ||
        "Unable to open the PDF. Please try again.";

      alert(message);
    }
  }
};


  const handlePremiumPayment = async () => {
    const token = getToken();

    if (!token) {
      alert("Please log in before purchasing a premium book.");
      navigate("/login");
      return;
    }

    if (paymentLoading) return;

    setPaymentLoading(true);

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Unable to load Razorpay Checkout.");
      }

      const orderResponse = await axios.post(
        `${API_URL}/api/payments/order`,
        { bookId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const {
        orderId,
        amount,
        currency,
        keyId,
        bookTitle,
      } = orderResponse.data;

      const checkout = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "Your Literary Collection",
        description: `Premium access: ${bookTitle}`,
        order_id: orderId,
        theme: { color: "#562c50" },

        handler: async (paymentResponse) => {
          try {
            const verification = await axios.post(
              `${API_URL}/api/payments/verify`,
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,
                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,
                razorpay_signature:
                  paymentResponse.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verification.data.success) {
              await checkAccess(book);
              alert(
                "Payment successful! This book is now unlocked for your account."
              );
            } else {
              alert("Payment could not be verified.");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert(
              error.response?.data?.message ||
                "Payment verification failed. Please contact support if you were charged."
            );
          } finally {
            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      });

      checkout.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert(
          response.error?.description || "Payment failed. Please try again."
        );
        setPaymentLoading(false);
      });

      checkout.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Could not start payment."
      );
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f4] font-['Plus_Jakarta_Sans',sans-serif] text-[#6b4a68]">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#ebe6e6] border-t-[#6b2d63]" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f4] px-6 text-center text-[#4a2745]">
        <h1 className="font-['Playfair_Display',Georgia,serif] text-3xl">
          Book not found
        </h1>
        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-md bg-[#562c50] px-5 py-3 text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f4] px-5 py-7 font-['Plus_Jakarta_Sans',sans-serif] text-[#4a2745] sm:px-8 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate("/")}
          className="mb-7 text-[13px] font-medium text-[#6b4a68] hover:text-[#6b2d63]"
        >
          ← Back to Books
        </button>

        <div className="mb-7">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b4a68]">
            The Literary Collection
          </p>
          <h1 className="font-['Playfair_Display',Georgia,serif] text-[32px] sm:text-[39px]">
            A closer look<span className="text-[#b17ba7]">.</span>
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-[#5f4a5d]">
            Every book holds a world waiting to be discovered.
          </p>
        </div>

        <section className="overflow-hidden rounded-md border border-[#ebe6e6] bg-white shadow-[0_12px_35px_-28px_rgba(74,39,69,0.3)]">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(260px,0.85fr)_1.4fr]">
            <div className="bg-[#f4f2ed] p-5 sm:p-7 md:p-8">
              <div className="mx-auto max-w-sm">
                <div className="relative overflow-hidden rounded-sm bg-[#f1eee8]">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="aspect-[3/4] w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center font-['Playfair_Display',Georgia,serif] text-5xl text-[#b17ba7]">
                      “ ”
                    </div>
                  )}

                  <span
                    className={`absolute left-4 top-4 rounded-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
                      book.accessType === "premium"
                        ? "bg-[#562c50] text-white"
                        : "border border-[#ebe6e6] bg-[#faf8f4] text-[#6b4a68]"
                    }`}
                  >
                    {book.accessType === "premium"
                      ? "Premium Edition"
                      : "Free Read"}
                  </span>
                </div>

                <div className="mt-5 border-t border-[#e5dfd8] pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a7787]">
                    From the collection
                  </p>
                  <p className="mt-2 font-['Playfair_Display',Georgia,serif] text-[18px] italic text-[#6b4a68]">
                    Every book opens a new world.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <span className="inline-flex w-fit rounded-sm bg-[#fbd9f5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a2d6e]">
                {book.category || "Uncategorized"}
              </span>

              <h2 className="mt-5 break-words font-['Playfair_Display',Georgia,serif] text-[27px] leading-tight sm:text-[33px] lg:text-[37px]">
                {book.title}
              </h2>

              <p className="mt-3 text-[14px] text-[#6b4a68]">
                Written by{" "}
                <span className="font-semibold text-[#4a2745]">
                  {book.author || "Unknown Author"}
                </span>
              </p>

              <div className="mt-5 flex flex-wrap gap-6 border-y border-[#ebe6e6] py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a7787]">
                    Reader Rating
                  </p>
                  <p className="mt-2 text-[14px] font-semibold">
                    <span className="mr-1 text-[#b17ba7]">★</span>
                    {book.rating ?? 0} / 5
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a7787]">
                    Access
                  </p>
                  <p className="mt-2 text-[13px] font-semibold capitalize">
                    {book.accessType || "Free"}
                  </p>
                </div>

                {book.accessType === "premium" && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a7787]">
                      Price
                    </p>
                    <p className="mt-2 text-[13px] font-semibold">
                      ₹{Number(book.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-['Playfair_Display',Georgia,serif] text-[21px]">
                  About this book
                </h3>
                <p className="mt-3 whitespace-pre-line text-[13px] leading-7 text-[#5f4a5d]">
                  {book.description || "No description available for this book yet."}
                </p>
              </div>

              <div className="mt-7 border-t border-[#ebe6e6] pt-5">
                {hasAccess ? (
                  <div>
                    <p className="mb-4 text-[11px] leading-6 text-[#8a7787]">
                      {book.accessType === "premium"
                        ? "You own this edition. Enjoy your read."
                        : "Settle in, turn the page, and enjoy your next read."}
                    </p>
                    <button
                      type="button"
                      onClick={openBook}
                      className="inline-flex items-center justify-center gap-3 rounded-md bg-[#562c50] px-5 py-3.5 text-[13px] font-semibold text-white transition hover:bg-[#6b2d63]"
                    >
                      Read Book <span className="text-[16px]">→</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4 text-[13px] leading-6 text-[#6b4a68]">
                      This title is part of our premium collection. Purchase
                      it to unlock this book for your account.
                    </p>
                    <button
                      type="button"
                      onClick={handlePremiumPayment}
                      disabled={paymentLoading}
                      className="inline-flex items-center justify-center gap-3 rounded-md bg-[#562c50] px-5 py-3.5 text-[13px] font-semibold text-white transition hover:bg-[#6b2d63] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {paymentLoading
                        ? "Processing..."
                        : `Get Premium Access · ₹${Number(
                            book.price || 0
                          ).toLocaleString("en-IN")}`}
                      {!paymentLoading && <span className="text-[16px]">↗</span>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-9 flex flex-col justify-between gap-3 border-t border-[#ebe6e6] py-5 text-[10px] uppercase tracking-[0.12em] text-[#8a7787] sm:flex-row">
          <span>Your Literary Collection</span>
          <span>Made for the love of reading.</span>
        </footer>
      </div>
    </main>
  );
};

export default BookDetails;