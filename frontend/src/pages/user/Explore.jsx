
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

/* ---------- tiny inline icon set (no extra dependency) ---------- */

const ICONS = {
    search: "M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z",
    chevron: "M6 9l6 6 6-6",
    star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    rows: "M4 4h16v7H4zM4 13h16v7H4z",
    refresh: "M20 11a8 8 0 00-14-4L4 9M4 4v5h5M4 13a8 8 0 0014 4l2-2M20 20v-5h-5",
    book: "M3 5h7a3 3 0 013 3v11a2 2 0 00-2-2H3zM21 5h-7a3 3 0 00-3 3v11a2 2 0 012-2h8z",
    sort: "M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3",
    key: "M14 10a4 4 0 11-3 6.5L4 17v-3l3-.5.5-2L10 11a4 4 0 014-1z",
};

const Icon = ({ name, className = "w-4 h-4", fill = false }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill={fill ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d={ICONS[name]} />
    </svg>
);

const CATEGORIES = [
    "All Categories",
    "Fiction",
    "Non-Fiction",
    "Philosophy",
    "Fine Arts",
    "Sciences & Nature",
];

const PAGE_SIZE = 10;

/* ---------- styled select with leading icon + chevron ---------- */

const SelectPill = ({ icon, value, onChange, children }) => (
    <label className="relative inline-flex min-w-0 max-w-full items-center rounded-lg bg-[#f4f0ec] text-base text-[#2b2230]">
        {icon && (
            <Icon
                name={icon}
                className="pointer-events-none absolute left-3 h-4 w-4 text-[#6b5a6b]"
            />
        )}

        <select
            value={value}
            onChange={onChange}
            className={`max-w-full appearance-none bg-transparent py-2.5 pr-9 text-base outline-none ${
                icon ? "pl-9" : "pl-3"
            } cursor-pointer`}
        >
            {children}
        </select>

        <Icon
            name="chevron"
            className="pointer-events-none absolute right-3 h-4 w-4 text-[#6b5a6b]"
        />
    </label>
);

const Explore = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [searchParams] = useSearchParams();

    /* design-only filter / view state */
    const [discipline, setDiscipline] = useState("All Categories");
    const [access, setAccess] = useState("all");
    const [sort, setSort] = useState("curator");
    const [view, setView] = useState("grid");
    const [page, setPage] = useState(1);

    const categoryFromUrl = searchParams.get("category");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/books"
                );

                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.books)
                      ? response.data.books
                      : [];

                setBooks(
                    data.filter(
                        (book) =>
                            !book.status ||
                            book.status === "published"
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to fetch books:",
                    error.response?.data || error.message
                );
            }
        };

        fetchBooks();
    }, []);

    /* ---------- Categories ---------- */

    const categories = [
        "all",
        ...new Set(
            books
                .map((book) => book.category)
                .filter(Boolean)
        ),
    ];

    /* ---------- Filtering ---------- */

    const filteredBooks = books.filter((book) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            book.title?.toLowerCase().includes(searchText) ||
            book.author?.toLowerCase().includes(searchText) ||
            book.category?.toLowerCase().includes(searchText);

        const matchesCategory =
            category === "all" ||
            book.category?.toLowerCase() === category.toLowerCase();

        const matchesUrlCategory =
            !categoryFromUrl ||
            book.category?.toLowerCase() ===
                categoryFromUrl.toLowerCase();

        const matchesDiscipline =
            discipline === "All Categories" ||
            (book.category &&
                String(book.category)
                    .toLowerCase()
                    .includes(discipline.toLowerCase()));

        const matchesAccess =
            access === "all" || book.accessType === access;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesUrlCategory &&
            matchesDiscipline &&
            matchesAccess
        );
    });

    /* ---------- Sorting ---------- */

    const sortedBooks =
        sort === "title"
            ? [...filteredBooks].sort((a, b) =>
                  a.title.localeCompare(b.title)
              )
            : sort === "author"
              ? [...filteredBooks].sort((a, b) =>
                    a.author.localeCompare(b.author)
                )
              : filteredBooks;

    const totalPages = Math.max(
        1,
        Math.ceil(sortedBooks.length / PAGE_SIZE)
    );

    const shownBooks = sortedBooks.slice(0, page * PAGE_SIZE);

    /* reset to first page whenever a filter changes */

    const withReset = (fn) => (e) => {
        fn(e);
        setPage(1);
    };

    const pageButtons = (() => {
        if (totalPages <= 4) {
            return Array.from(
                { length: totalPages },
                (_, i) => i + 1
            );
        }

        return [1, 2, 3, "…", totalPages];
    })();

    const isList = view === "list";

    return (
        <div className="min-h-screen w-full overflow-x-clip bg-[#faf8f5] font-['Plus_Jakarta_Sans',sans-serif] text-[#2b2230]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

                .serif {
                    font-family: 'Playfair Display', Georgia, serif;
                }
            `}</style>

            {/* ================= NAVBAR ================= */}

            <Navbar />

            {/* ================= HEADER ================= */}

            <header className="bg-gradient-to-b from-[#f8eef6] to-[#faf8f5]">
                <div className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-8">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base uppercase tracking-wider text-[#6b5f6b]">
                        <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5a2458]" />
                            Curated digital folios
                        </span>

                        <span className="text-base normal-case tracking-normal text-[#8a7f8a]">
                            Monograph Archive No. 14
                        </span>
                    </div>

                    <div className="mt-5 flex flex-col gap-6 lg:mt-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <h1 className="serif text-4xl leading-tight text-[#2b2230] sm:text-5xl lg:text-6xl">
                                Explore the Library
                            </h1>

                            <p className="serif mt-3 text-xl italic text-[#6b5f6b] sm:text-2xl">
                                Find something you'll want to read.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
                {/* ================= SEARCH & FILTER ================= */}

                <section className="mb-8 rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(60,20,60,0.06)] sm:mb-10 sm:p-6">
                    {/* Search input */}

                    <div className="flex min-w-0 items-center gap-3 rounded-lg bg-[#f4f0ec] px-3 py-3 sm:px-4">
                        <Icon
                            name="search"
                            className="h-5 w-5 shrink-0 text-[#4a4050]"
                        />

                        <input
                            type="text"
                            placeholder="Search by title, author, or category..."
                            value={search}
                            onChange={withReset((e) =>
                                setSearch(e.target.value)
                            )}
                            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#4a4050]"
                        />

                        <span className="hidden shrink-0 rounded bg-white/70 px-2 py-0.5 text-base text-[#6b5f6b] lg:inline">
                            ⌘ K
                        </span>
                    </div>

                    {/* Category Pills */}

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <span className="mr-2 text-base uppercase tracking-wider text-[#4a4050]">
                            Category:
                        </span>

                        {CATEGORIES.map((item) => {
                            const active = discipline === item;

                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => {
                                        setDiscipline(item);
                                        setPage(1);
                                    }}
                                    className={`rounded-full px-3 py-2 text-base transition-colors sm:px-4 ${
                                        active
                                            ? "bg-[#4a1d49] font-medium text-white"
                                            : "bg-[#f4f0ec] text-[#4a4050] hover:bg-[#ebe3e8]"
                                    }`}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>

                    {/* Select filters */}

                    <div className="mt-4 flex flex-wrap gap-3">
                        <SelectPill
                            icon="book"
                            value={category}
                            onChange={withReset((e) =>
                                setCategory(e.target.value)
                            )}
                        >
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item === "all"
                                        ? "All Categories"
                                        : item}
                                </option>
                            ))}
                        </SelectPill>

                        <SelectPill
                            icon="key"
                            value={access}
                            onChange={withReset((e) =>
                                setAccess(e.target.value)
                            )}
                        >
                            <option value="all">
                                Access: All Editions
                            </option>
                            <option value="free">
                                Access: Free to Read
                            </option>
                            <option value="premium">
                                Access: Premium
                            </option>
                        </SelectPill>

                        <SelectPill
                            icon="sort"
                            value={sort}
                            onChange={withReset((e) =>
                                setSort(e.target.value)
                            )}
                        >
                            <option value="curator">
                                Curator's Selection
                            </option>
                            <option value="title">
                                Title (A–Z)
                            </option>
                            <option value="author">
                                Author (A–Z)
                            </option>
                        </SelectPill>
                    </div>
                </section>

                {/* ================= CATALOG BAR ================= */}

                <div className="mb-6 flex flex-col gap-4 rounded-lg bg-[#f4f0ec] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                        <span className="text-base uppercase tracking-wider text-[#6b5f6b]">
                            Showing catalog:
                        </span>

                        <span className="text-base font-semibold">
                            {sortedBooks.length} Monographic Works
                        </span>

                        <span className="hidden text-base text-[#8a7f8a] lg:inline">
                            Unabridged Digital Typesets
                        </span>
                    </div>

                    <div className="flex items-center gap-4 self-end text-[#5a2458] sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setView("grid")}
                            aria-label="Grid view"
                            aria-pressed={view === "grid"}
                            className={`rounded-md p-2 transition-colors hover:bg-white/70 ${
                                view === "grid"
                                    ? "opacity-100"
                                    : "opacity-40"
                            }`}
                        >
                            <Icon name="grid" className="h-5 w-5" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setView("list")}
                            aria-label="List view"
                            aria-pressed={view === "list"}
                            className={`rounded-md p-2 transition-colors hover:bg-white/70 ${
                                view === "list"
                                    ? "opacity-100"
                                    : "opacity-40"
                            }`}
                        >
                            <Icon name="rows" className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* ================= BOOKS ================= */}

                {sortedBooks.length === 0 ? (
                    <div className="rounded-2xl border border-[#efe9e4] bg-white p-8 text-center sm:p-10">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f0ec] text-[#5a2458]">
                            <Icon name="book" className="h-7 w-7" />
                        </div>

                        <p className="mt-4 text-base text-[#7b6f7b]">
                            No books found.
                        </p>
                    </div>
                ) : (
                    <div
                        className={
                            isList
                                ? "flex flex-col gap-4"
                                : "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
                        }
                    >
                        {shownBooks.map((book) => (
                            <article
                                key={book._id}
                                onClick={() =>
                                    navigate(`/book/${book._id}`)
                                }
                                className={`cursor-pointer rounded-xl border border-[#f0eae5] bg-white p-2.5 transition-shadow hover:shadow-[0_10px_30px_rgba(60,20,60,0.1)] ${
                                    isList
                                        ? "flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5"
                                        : "flex min-w-0 flex-col"
                                }`}
                            >
                                {/* Book cover */}

                                <div
                                    className={`relative shrink-0 overflow-hidden rounded-lg bg-[#ece7e1] ${
                                        isList
                                            ? "h-56 w-full sm:h-48 sm:w-36"
                                            : "aspect-[3/4] w-full"
                                    }`}
                                >
                                    {book.image ? (
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-base text-[#a99fa9]">
                                            No Image
                                        </div>
                                    )}

                                    <span
                                        className={`absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded px-2 py-1 text-base uppercase tracking-wide ${
                                            book.accessType === "premium"
                                                ? "bg-[#5a2458] text-white"
                                                : "bg-[#f5e4f4] text-[#5a2458]"
                                        }`}
                                    >
                                        {book.accessType === "premium"
                                            ? "Premium Access"
                                            : "Free to Read"}
                                    </span>
                                </div>

                                {/* Book details */}

                                <div
                                    className={`flex min-w-0 flex-1 flex-col px-1.5 pb-1.5 pt-3 ${
                                        isList
                                            ? "sm:justify-between"
                                            : ""
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <p className="text-base uppercase tracking-wide text-[#6b5f6b]">
                                            {book.category}
                                            {book.readTime
                                                ? ` • ${book.readTime} read`
                                                : ""}
                                        </p>

                                        <h2 className="serif mt-1.5 line-clamp-2 text-xl leading-snug">
                                            {book.title}
                                        </h2>

                                        <p className="mt-1 text-base text-[#6b5f6b]">
                                            {book.author}
                                        </p>

                                        {isList && book.description && (
                                            <p className="mt-3 line-clamp-3 max-w-xl text-base text-[#7b6f7b]">
                                                {book.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3 text-base">
                                        <span className="flex min-w-0 items-center gap-1 font-medium">
                                            {book.rating ? (
                                                <>
                                                    <Icon
                                                        name="star"
                                                        className="h-4 w-4 shrink-0"
                                                        fill
                                                    />
                                                    <span>
                                                        {book.rating}
                                                        {book.reviewCount
                                                            ? ` (${book.reviewCount})`
                                                            : ""}
                                                    </span>
                                                </>
                                            ) : null}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(
                                                    `/book/${book._id}`
                                                );
                                            }}
                                            className="shrink-0 text-base font-semibold uppercase tracking-wide text-[#5a2458] hover:underline"
                                        >
                                            {book.accessType === "free"
                                                ? "Read"
                                                : "View Book"}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* ================= CURATOR'S INDEX ================= */}

                {sortedBooks.length > 0 && (
                    <div className="py-14 text-center sm:py-20">
                        <div className="flex items-center justify-center gap-3 text-base uppercase tracking-wider text-[#6b5f6b] sm:gap-4">
                            <span className="h-px w-8 bg-[#ddd3da] sm:w-12" />
                            Curator's index
                            <span className="h-px w-8 bg-[#ddd3da] sm:w-12" />
                        </div>

                        <p className="mx-auto mt-3 max-w-xs text-base text-[#4a4050] sm:max-w-md">
                            Displaying {shownBooks.length} of{" "}
                            {sortedBooks.length.toLocaleString()} preserved
                            manuscripts &amp; monographs in the digital
                            catalog.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setPage((p) =>
                                    Math.min(p + 1, totalPages)
                                )
                            }
                            disabled={page >= totalPages}
                            className="mt-6 inline-flex max-w-full items-center justify-center gap-2 rounded-lg bg-[#f4f0ec] px-5 py-3 text-base font-medium text-[#4a1d49] transition-colors hover:bg-[#ebe3e8] disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
                        >
                            <Icon name="refresh" />
                            Load More Curated Titles
                        </button>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-base">
                            {pageButtons.map((p, i) =>
                                p === "…" ? (
                                    <span
                                        key={`dots-${i}`}
                                        className="px-1 text-[#8a7f8a]"
                                    >
                                        …
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => setPage(p)}
                                        aria-current={
                                            page === p ? "page" : undefined
                                        }
                                        className={`h-9 min-w-9 rounded-md px-2 ${
                                            page === p
                                                ? "bg-[#ebe3e8] font-semibold text-[#4a1d49]"
                                                : "text-[#4a4050] hover:bg-[#f4f0ec]"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* ================= FOOTER ================= */}

            <Footer />
        </div>
    );
};

export default Explore;