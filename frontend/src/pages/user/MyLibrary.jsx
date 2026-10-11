
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { API_URL } from "../../api";

const MyLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLibrary = async () => {
      const token = localStorage.getItem("userToken");

      if (!token) {
        setError("Please log in to view your library.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/payments/library`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBooks(response.data.books || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your library."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Plus_Jakarta_Sans',sans-serif] text-[#4a2745]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .library-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }

        .library-grain {
          background-image: radial-gradient(#6b2d63 0.55px, transparent 0.55px);
          background-size: 12px 12px;
        }
      `}</style>

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-[#ebe6e6] bg-[#f4f2ed]">
          <div className="library-grain pointer-events-none absolute inset-0 opacity-[0.12]" />

          <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#6b2d63]" />
                  <p className="text-base font-semibold uppercase tracking-[0.2em] text-[#6b2d63]">
                    Your personal collection
                  </p>
                </div>

                <h1 className="library-serif text-5xl leading-[1.12] tracking-tight text-[#4a2745] sm:text-6xl lg:text-7xl">
                  My Library
                  <span className="library-serif block italic text-[#8b6284]">
                    A world between pages.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-[#6b4a68] sm:text-lg">
                  Every book you collect becomes a new place to wander.
                  Return to your favourite stories and continue where
                  your curiosity last took you.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4 border-t border-[#dcd2dc] pt-6 lg:min-w-52 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <div className="library-serif text-5xl text-[#6b2d63]">
                  {books.length.toString().padStart(2, "0")}
                </div>
                <div>
                  <p className="text-base font-semibold text-[#4a2745]">
                    Collected books
                  </p>
                  <p className="mt-1 text-base text-[#6b4a68]">
                    Your reading shelf
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#e3dce0] pt-5">
              <p className="text-base text-[#6b4a68]">
                An archive curated by you, one story at a time.
              </p>

              <Link
                to="/explore"
                className="group inline-flex items-center gap-3 text-base font-semibold text-[#562c50] transition-colors hover:text-[#8b6284]"
              >
                Discover more books
                <span className="text-xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Library Content */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#ebe6e6] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-base font-semibold uppercase tracking-[0.18em] text-[#8b6284]">
                The reading room
              </p>

              <h2 className="library-serif text-3xl text-[#4a2745] sm:text-4xl">
                Books on your shelf
              </h2>

              <p className="mt-3 text-base leading-7 text-[#6b4a68]">
                Your purchased premium books, gathered in one place.
              </p>
            </div>

            {!loading && !error && books.length > 0 && (
              <p className="text-base text-[#6b4a68]">
                {books.length} {books.length === 1 ? "book" : "books"} in
                your collection
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-[#ebe6e6] bg-white px-6 py-16 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f2ed]">
                <svg
                  className="h-7 w-7 animate-spin text-[#6b2d63]"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-20"
                  />
                  <path
                    d="M21 12a9 9 0 00-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="library-serif text-2xl text-[#4a2745]">
                Turning the pages...
              </h3>

              <p className="mt-3 text-base text-[#6b4a68]">
                Your collection is being prepared.
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="rounded-md border border-[#e7d8e4] bg-white px-6 py-12 text-center sm:px-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f0f4]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-8 w-8 text-[#6b2d63]"
                  aria-hidden="true"
                >
                  <path
                    d="M12 8v4m0 4h.01M10.3 3.9L2.9 17a2 2 0 001.7 3h14.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="library-serif text-3xl text-[#4a2745]">
                Your shelf is out of reach
              </h3>

              <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#6b4a68]">
                {error}
              </p>

              <Link
                to="/login"
                className="mt-7 inline-flex items-center justify-center rounded-md bg-[#562c50] px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-[#6b2d63]"
              >
                Sign in to your account
              </Link>
            </div>
          ) : books.length === 0 ? (
            /* Empty Library State */
            <div className="relative overflow-hidden rounded-md border border-[#ebe6e6] bg-white px-6 py-14 text-center sm:px-12 sm:py-20">
              <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#f4f0f4] opacity-70 blur-3xl" />

              <div className="relative mx-auto max-w-xl">
                <div className="library-serif mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[#e7dce6] bg-[#faf8f4] text-4xl text-[#6b2d63]">
                  ❧
                </div>

                <p className="mb-4 text-base font-semibold uppercase tracking-[0.18em] text-[#8b6284]">
                  A story yet to begin
                </p>

                <h3 className="library-serif text-3xl leading-tight text-[#4a2745] sm:text-4xl">
                  Your shelves are waiting.
                </h3>

                <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[#6b4a68]">
                  Your next favourite book is out there. Explore our
                  collection, discover a story that speaks to you, and
                  your purchased premium books will find their home here.
                </p>

                <Link
                  to="/explore"
                  className="group mt-8 inline-flex items-center gap-3 rounded-md bg-[#562c50] px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-[#6b2d63]"
                >
                  Explore the collection
                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <p className="mt-5 text-base text-[#8b6284]">
                  Find a book. Find a new world.
                </p>
              </div>
            </div>
          ) : (
            /* Purchased Books Grid */
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-x-7 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <article
                  key={book._id}
                  className="group flex flex-col overflow-hidden rounded-md border border-[#ebe6e6] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#d7c4d5] hover:shadow-[0_16px_40px_rgba(74,39,69,0.09)]"
                >
                  <Link
                    to={`/book/${book._id}`}
                    className="relative block overflow-hidden bg-[#f1eee8]"
                    aria-label={`View ${book.title}`}
                  >
                    {book.image ? (
                      <img
                        src={
                          book.image.startsWith("http")
                            ? book.image
                            : `${API_URL}${
                                book.image.startsWith("/") ? "" : "/"
                              }${book.image}`
                        }
                        alt={book.title}
                        loading="lazy"
                        className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="library-serif flex aspect-[3/4] flex-col items-center justify-center gap-4 bg-[#f1eee8] px-6 text-center text-[#8b6284]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          className="h-12 w-12"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 5.5A2.5 2.5 0 016.5 3H20v16H6.5A2.5 2.5 0 014 16.5zM4 16.5A2.5 2.5 0 016.5 14H20M8 7h8M8 10h6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <span className="text-base italic">
                          {book.title || "A story awaits"}
                        </span>
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center gap-2 rounded-sm border border-white/60 bg-[#faf8f4]/95 px-3 py-2 text-base font-semibold text-[#562c50] shadow-sm">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 12l5 5L20 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        In your library
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="mb-3 text-base font-semibold uppercase tracking-[0.14em] text-[#8b6284]">
                      {book.category || "From the collection"}
                    </p>

                    <h3 className="library-serif text-2xl leading-snug text-[#4a2745]">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-base text-[#6b4a68]">
                      By {book.author || "Unknown Author"}
                    </p>

                    {book.description && (
                      <p className="mt-4 line-clamp-3 text-base leading-7 text-[#6b4a68]">
                        {book.description}
                      </p>
                    )}

                    <div className="mt-auto pt-6">
                      <div className="mb-4 border-t border-[#ebe6e6]" />

                      <Link
                        to={`/book/${book._id}`}
                        className="group/link flex w-full items-center justify-between rounded-md bg-[#f4f2ed] px-4 py-3 text-base font-semibold text-[#562c50] transition-colors hover:bg-[#562c50] hover:text-white"
                      >
                        <span>Open book</span>
                        <span className="text-xl transition-transform group-hover/link:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Bottom Discovery Link */}
          {!loading && !error && books.length > 0 && (
            <div className="mt-16 border-t border-[#ebe6e6] pt-8 text-center">
              <p className="library-serif text-2xl italic text-[#6b4a68]">
                There is always another world to discover.
              </p>

              <Link
                to="/explore"
                className="mt-5 inline-flex items-center gap-3 text-base font-semibold text-[#6b2d63] hover:text-[#8b6284]"
              >
                Continue exploring
                <span className="text-xl">→</span>
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyLibrary;
