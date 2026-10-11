
import { useEffect, useState } from "react";
import axios from "axios";

import { API_BASE_URL } from "../../api";

const API_URL = `${API_BASE_URL}/books`;

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    image: "",
    contentUrl: "",
    accessType: "free",
    rating: 0,
    price: 0,
  });

  const token = localStorage.getItem("adminToken");

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL);
      const fetchedBooks = Array.isArray(response.data)
        ? response.data
        : response.data.books || [];

      setBooks(fetchedBooks);
    } catch (error) {
      console.error(
        "Failed to fetch books:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle PDF selection
  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];

    if (file && file.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      e.target.value = "";
      setPdfFile(null);
      return;
    }

    setPdfFile(file || null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      category: "",
      image: "",
      contentUrl: "",
      accessType: "free",
      rating: 0,
      price: 0,
    });

    setPdfFile(null);
    setEditingBook(null);
  };

  // Add or update a book
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!token) {
      alert("Admin token not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      let contentUrl = formData.contentUrl;

      // Upload PDF if a new file is selected
      if (pdfFile) {
        const pdfData = new FormData();
        pdfData.append("pdf", pdfFile);

        const uploadResponse = await axios.post(
          `${API_URL}/upload`,
          pdfData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        contentUrl = uploadResponse.data.contentUrl;
      }

      const bookData = {
        ...formData,
        contentUrl,
        rating: Number(formData.rating),
        price:
          formData.accessType === "premium"
            ? Number(formData.price)
            : 0,
      };

      if (editingBook) {
        await axios.put(
          `${API_URL}/${editingBook._id}`,
          bookData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Book updated successfully!");
      } else {
        await axios.post(API_URL, bookData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Book added successfully!");
      }

      resetForm();
      setShowForm(false);
      await fetchBooks();
    } catch (error) {
      console.error(
        "Failed to save book:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save book. Check the browser console."
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit a book
  const handleEdit = (book) => {
    setEditingBook(book);

    setFormData({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      category: book.category || "",
      image: book.image || "",
      contentUrl: book.contentUrl || "",
      accessType: book.accessType || "free",
      rating: book.rating ?? 0,
      price: book.price ?? 0,
    });

    setPdfFile(null);
    setShowForm(true);
  };

  // Delete a book
  const handleDelete = async (id) => {
    if (!id) {
      alert("Book ID is missing.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    if (!token) {
      alert("Admin token not found. Please log in again.");
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Book deleted successfully!");
      await fetchBooks();
    } catch (error) {
      console.error(
        "Failed to delete book:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete book. Check the browser console."
      );
    }
  };

  const inputClass =
    "w-full rounded-md border border-[#ebe6e6] bg-[#faf8f4] px-4 py-3 text-sm text-[#4a2745] placeholder:text-[#9a8797] outline-none transition focus:border-[#6b2d63] focus:ring-2 focus:ring-[#6b2d63]/10";

  const labelClass =
    "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b4a68]";

  const primaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-md bg-[#562c50] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#6b2d63] focus:outline-none focus:ring-2 focus:ring-[#6b2d63]/25 disabled:cursor-not-allowed disabled:opacity-60";

  const secondaryButtonClass =
    "rounded-md border border-[#ebe6e6] bg-white px-5 py-3 text-[13px] font-semibold text-[#4a2745] transition hover:bg-[#f4f2ed] disabled:opacity-60";

  return (
    <div className="min-h-screen bg-[#faf8f4] px-6 py-10 font-['Plus_Jakarta_Sans',sans-serif] text-[#4a2745] md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-7 bg-[#6b2d63]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b4a68]">
                The Literary Collection
              </span>
            </div>

            <h1 className="font-['Playfair_Display',serif] text-4xl font-normal leading-tight tracking-tight text-[#4a2745] md:text-6xl">
              Your Bookshelf<span className="text-[#b17ba7]">.</span>
            </h1>

            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#5f4a5d]">
              Curate your collection, discover new stories, and manage every
              title in your bookstore.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className={`${primaryButtonClass} self-start sm:self-auto`}
          >
            <span className="text-lg leading-none">+</span>
            Add New Book
          </button>
        </header>

        {/* Collection Overview */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-[#ebe6e6] bg-white p-5 md:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b4a68]">
              Total Collection
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <h2 className="font-['Playfair_Display',serif] text-4xl text-[#4a2745]">
                {books.length}
              </h2>
              <span className="text-2xl text-[#b17ba7]">▤</span>
            </div>
            <p className="mt-2 text-[13px] text-[#8a7787]">
              Books in your library
            </p>
          </div>

          <div className="rounded-md border border-[#ebe6e6] bg-[#f4f2ed] p-5 md:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b4a68]">
              Free Reads
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <h2 className="font-['Playfair_Display',serif] text-4xl text-[#4a2745]">
                {books.filter((book) => book.accessType !== "premium").length}
              </h2>
              <span className="text-2xl text-[#b17ba7]">♡</span>
            </div>
            <p className="mt-2 text-[13px] text-[#8a7787]">
              Stories open to everyone
            </p>
          </div>

          <div className="rounded-md border border-[#ebe6e6] bg-[#f1eee8] p-5 md:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b4a68]">
              Premium Titles
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <h2 className="font-['Playfair_Display',serif] text-4xl text-[#4a2745]">
                {books.filter((book) => book.accessType === "premium").length}
              </h2>
              <span className="text-2xl text-[#6b2d63]">✧</span>
            </div>
            <p className="mt-2 text-[13px] text-[#8a7787]">
              Exclusive literary editions
            </p>
          </div>
        </section>

        {/* Add / Edit Form */}
        {showForm && (
          <section className="mb-8 rounded-md border border-[#ebe6e6] bg-white p-6 shadow-[0_8px_30px_-24px_rgba(74,39,69,0.22)] md:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b4a68]">
                  {editingBook ? "Refine your collection" : "New addition"}
                </p>
                <h2 className="font-['Playfair_Display',serif] text-3xl font-normal text-[#4a2745]">
                  {editingBook ? "Edit Book" : "Add a New Story"}
                </h2>
                <p className="mt-2 text-[13px] leading-6 text-[#8a7787]">
                  Fill in the details below to manage your literary collection.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close form"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#ebe6e6] text-xl text-[#6b4a68] transition hover:bg-[#f4f2ed]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Book Title *</label>
                  <input
                    name="title"
                    placeholder="Enter the book title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Author Name *</label>
                  <input
                    name="author"
                    placeholder="Enter the author's name"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Category *</label>
                  <input
                    name="category"
                    placeholder="e.g. Fiction, Mystery, Romance"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Book Cover URL</label>
                  <input
                    name="image"
                    type="url"
                    placeholder="https://example.com/cover.jpg"
                    value={formData.image}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Upload Book PDF (Optional)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handlePdfChange}
                    className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-[#fbd9f5] file:px-3 file:py-2 file:text-[13px] file:font-semibold file:text-[#7a2d6e]`}
                  />

                  {pdfFile && (
                    <p className="mt-2 break-all text-[13px] text-[#6b2d63]">
                      Selected: {pdfFile.name}
                    </p>
                  )}

                  {!pdfFile && formData.contentUrl && (
                    <p className="mt-2 text-[13px] text-[#6b4a68]">
                      An existing PDF link is saved.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Access Type</label>
                  <select
                    name="accessType"
                    value={formData.accessType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                {formData.accessType === "premium" && (
                  <div>
                    <label className={labelClass}>Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="e.g. 199"
                      value={formData.price}
                      onChange={handleChange}
                      min="1"
                      step="1"
                      required
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <label className={labelClass}>Rating (0–5)</label>
                  <input
                    type="number"
                    name="rating"
                    placeholder="0.0"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className={labelClass}>Book Description</label>
                <textarea
                  name="description"
                  placeholder="Write a short introduction to this book..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputClass} resize-y leading-7`}
                />
              </div>

              <div className="mt-7 flex flex-wrap gap-3 border-t border-[#ebe6e6] pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={primaryButtonClass}
                >
                  {loading
                    ? "Saving..."
                    : editingBook
                      ? "Update Book"
                      : "Add Book to Collection"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className={secondaryButtonClass}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Books Collection */}
        <section className="rounded-md border border-[#ebe6e6] bg-white p-5 shadow-[0_8px_30px_-24px_rgba(74,39,69,0.22)] md:p-8">
          <div className="mb-7 flex flex-col justify-between gap-3 border-b border-[#ebe6e6] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b4a68]">
                Curated Library
              </p>
              <h2 className="font-['Playfair_Display',serif] text-3xl font-normal text-[#4a2745]">
                All Books
                <span className="ml-3 align-middle font-['Plus_Jakarta_Sans',sans-serif] text-[15px] font-medium text-[#8a7787]">
                  ({books.length})
                </span>
              </h2>
            </div>

            <p className="text-[13px] text-[#8a7787]">
              Every story has a place.
            </p>
          </div>

          {books.length === 0 ? (
            <div className="rounded-md bg-[#f4f2ed] px-5 py-12 text-center">
              <div className="mb-4 font-['Playfair_Display',serif] text-4xl text-[#b17ba7]">
                “ ”
              </div>
              <h3 className="font-['Playfair_Display',serif] text-xl text-[#4a2745]">
                Your bookshelf awaits
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-[#8a7787]">
                No books found yet. Add your first title to begin your
                collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <article
                  key={book._id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-[#ebe6e6] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_35px_-20px_rgba(74,39,69,0.3)]"
                >
                  {/* Book Cover */}
                  <div className="relative overflow-hidden bg-[#f4f2ed] p-3">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-64 w-full rounded-sm object-cover transition duration-300 group-hover:scale-[1.02]"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-64 w-full flex-col items-center justify-center rounded-sm bg-[#f1eee8] px-4 text-center">
                        <span className="font-['Playfair_Display',serif] text-5xl text-[#b17ba7]">
                          “ ”
                        </span>
                        <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8a7787]">
                          No cover image
                        </span>
                      </div>
                    )}

                    <span
                      className={`absolute right-5 top-5 rounded-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        book.accessType === "premium"
                          ? "bg-[#562c50] text-white"
                          : "border border-[#ebe6e6] bg-[#faf8f4] text-[#6b4a68]"
                      }`}
                    >
                      {book.accessType === "premium" ? "Premium" : "Free"}
                    </span>
                  </div>

                  {/* Book Details */}
                  <div className="flex flex-1 flex-col p-4">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a2d6e]">
                      {book.category || "Uncategorized"}
                    </p>

                    <h3 className="font-['Playfair_Display',serif] text-xl leading-snug text-[#4a2745]">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-[13px] text-[#6b4a68]">
                      By {book.author || "Unknown Author"}
                    </p>

                    <div className="mt-4">
                      <span className="text-md text-[#8a7787]">
                        ★ {book.rating ?? 0}/5
                      </span>
                    </div>

                    {book.accessType === "premium" && (
                      <p className="mt-2 text-sm font-semibold text-[#6b2d63]">
                        ₹{book.price ?? 0}
                      </p>
                    )}

                    <p className="mt-4 line-clamp-3 flex-1 text-[13px] leading-6 text-[#5f4a5d]">
                      {book.description || "No description available."}
                    </p>

                    {/* Edit and Delete */}
                    <div className="mt-5 flex gap-2 border-t border-[#ebe6e6] pt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(book)}
                        className="flex-1 rounded-md bg-[#f4f2ed] px-3 py-2.5 text-[13px] font-semibold text-[#4a2745] transition hover:bg-[#f1eee8]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(book._id)}
                        className="flex-1 rounded-md border border-[#ead8e5] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#8a435f] transition hover:bg-[#fdf4f8]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-[#ebe6e6] py-5 text-[11px] uppercase tracking-[0.12em] text-[#8a7787] sm:flex-row">
          <span>Your Literary Collection</span>
          <span>Every book opens a new world.</span>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;