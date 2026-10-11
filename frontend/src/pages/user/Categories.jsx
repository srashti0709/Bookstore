import { API_URL, API_BASE_URL } from "../../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

/* ---------- tiny inline icon set (no extra dependency) ---------- */

const ICONS = {
  search: "M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  book: "M3 5h7a3 3 0 013 3v11a2 2 0 00-2-2H3zM21 5h-7a3 3 0 00-3 3v11a2 2 0 012-2h8z",
  check: "M5 12l5 5L20 7",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  award:
    "M12 15a6 6 0 100-12 6 6 0 000 12zM8.5 14l-1 7 4.5-2.5 4.5 2.5-1-7",
};

const Icon = ({ name, className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={ICONS[name]} />
  </svg>
);

/* ---------- card colour themes ---------- */

const THEMES = {
  light: {
    card: "bg-white border border-[#efe9e4]",
    eyebrow: "text-[#7a4a78]",
    count: "text-[#a99fa9]",
    title: "text-[#2b2230]",
    desc: "text-[#4a4050]",
    foot: "text-[#6b5f6b]",
    link: "text-[#2b2230]",
    chip: "bg-[#f1eeea] text-[#5b4f5b]",
    arrowBtn: "bg-[#f3eef2] text-[#5a2458]",
  },
  cream: {
    card: "bg-[#f4f0ec] border border-[#efe9e4]",
    eyebrow: "text-[#7a4a78]",
    count: "text-[#a99fa9]",
    title: "text-[#2b2230]",
    desc: "text-[#4a4050]",
    foot: "text-[#6b5f6b]",
    link: "text-[#2b2230]",
    chip: "bg-white text-[#5b4f5b]",
    arrowBtn: "bg-white text-[#5a2458]",
  },
  stone: {
    card: "bg-[#ebe8e3] border border-[#e4e0da]",
    eyebrow: "text-[#7a4a78]",
    count: "text-[#8f858f]",
    title: "text-[#2b2230]",
    desc: "text-[#4a4050]",
    foot: "text-[#6b5f6b]",
    link: "text-[#2b2230]",
    chip: "bg-white text-[#5b4f5b]",
    arrowBtn: "bg-white text-[#5a2458]",
  },
  plum: {
    card: "bg-[#4a1d49]",
    eyebrow: "text-[#e5c8e3]",
    count: "text-[#d9bfd8]",
    title: "text-white",
    desc: "text-[#d9bfd8]",
    foot: "text-[#e5d0e3]",
    link: "text-white",
    chip: "bg-white/15 text-white",
    arrowBtn: "bg-white/15 text-white",
  },
  plumSoft: {
    card: "bg-[#5a2458]",
    eyebrow: "text-[#e5c8e3]",
    count: "text-[#d9bfd8]",
    title: "text-white",
    desc: "text-[#d9bfd8]",
    foot: "text-[#e5d0e3]",
    link: "text-white",
    chip: "bg-white/15 text-white",
    arrowBtn: "bg-white/15 text-white",
  },
  charcoal: {
    card: "bg-[#33312f]",
    eyebrow: "text-[#cfc9c4]",
    count: "text-[#bdb6b0]",
    title: "text-white",
    desc: "text-[#cfc9c4]",
    foot: "text-[#cfc9c4]",
    link: "text-white",
    chip: "bg-white/15 text-white",
    arrowBtn: "bg-white/15 text-white",
  },
};

/* ---------- shelves ---------- */

const SHELVES = [
  {
    id: "literary",
    title: "Literary Fiction",
    category: "Fiction",
    match: ["fiction", "literary fiction"],
    variant: "feature",
    theme: "light",
    span: "sm:col-span-2 lg:col-span-4",
    minH: "min-h-[460px]",
    unit: "Volumes",
    desc: "Expansive interior landscapes, lyrical language, and unsparing human truth. From generational post-war chronicles to intimate modernist vignettes.",
  },
  {
    id: "nonfiction",
    title: "Non-Fiction",
    category: "Non-Fiction",
    match: ["non-fiction", "nonfiction", "non fiction"],
    variant: "stack",
    theme: "plum",
    span: "lg:col-span-2",
    minH: "min-h-[460px]",
    titleSize: "text-4xl",
    unit: "Titles",
    desc: "Architectural critiques, long-form investigative reportage, critical theory, and the anatomy of human institutions.",
    tag: "Critical Studies",
    strongFoot: true,
  },
  {
    id: "romance",
    title: "Romance & Devotion",
    category: "Romance",
    match: ["romance"],
    variant: "stack",
    theme: "cream",
    span: "lg:col-span-2",
    minH: "min-h-[410px]",
    titleSize: "text-3xl",
    unit: "Volumes",
    desc: "Delicate epistolary narratives, quiet yearnings, classical courtship, and contemporary emotional landscapes.",
    tag: "Pastoral • Contemporary",
  },
  {
    id: "fantasy",
    title: "Fantasy & Myth",
    category: "Fantasy",
    match: ["fantasy"],
    variant: "stack",
    theme: "plumSoft",
    span: "lg:col-span-2",
    minH: "min-h-[410px]",
    titleSize: "text-3xl",
    unit: "Volumes",
    desc: "Intricately built cosmologies, archaic folklore, celestial voyages, and legendary epics written with rigorous depth.",
    tag: "High Lore • Folk Tales",
  },
  {
    id: "thriller",
    title: "Thriller & Noir",
    category: "Thriller",
    match: ["thriller", "noir"],
    variant: "stack",
    theme: "charcoal",
    span: "lg:col-span-2",
    minH: "min-h-[410px]",
    titleSize: "text-3xl",
    unit: "Volumes",
    desc: "High-tension psychological fractures, foggy docks, rain-streaked tramways, and cold moral compromises.",
    tag: "Noir • Espionage",
  },
  {
    id: "mystery",
    title: "Mystery & Clues",
    category: "Mystery",
    match: ["mystery"],
    variant: "stack",
    theme: "stone",
    span: "lg:col-span-2",
    minH: "min-h-[410px]",
    titleSize: "text-3xl",
    unit: "Volumes",
    desc: "Locked studies, country manor puzzles, cryptographic manuscripts, and deliberate procedural investigations.",
    tag: "Whodunit • Ciphers",
    titleIcon: "search",
  },
  {
    id: "biography",
    title: "Biography & Lives",
    category: "Biography",
    match: ["biography"],
    variant: "stack",
    theme: "cream",
    span: "lg:col-span-2",
    minH: "min-h-[410px]",
    titleSize: "text-3xl",
    unit: "Volumes",
    desc: "The private journals of luminaries, candid memoirs of exile, and definitive biographical portraits across centuries.",
    tag: "Letters • Monograph",
  },
  {
    id: "reflection",
    title: "Quiet Reflection",
    category: "Self-Help",
    match: ["self-help", "self help", "philosophy", "reflection"],
    variant: "stack",
    theme: "cream",
    span: "lg:col-span-2",
    minH: "min-h-[410px]",
    titleSize: "text-3xl",
    unit: "Volumes",
    desc: "Mindful practices, Stoic maxims, slow living manifestos, and restorative psychological counsel for modern noise.",
    tag: "Presence • Stoicism",
  },
  {
    id: "science",
    title: "Science & Cosmos",
    category: "Science",
    match: ["science"],
    variant: "side",
    theme: "light",
    span: "sm:col-span-1 lg:col-span-3",
    minH: "min-h-[250px]",
    unit: "Titles",
    desc: "Quantum mechanics, natural histories of deep time, mathematical wonder, and the living systems of Earth.",
    chips: ["Physics", "Ecology"],
  },
  {
    id: "history",
    title: "Civilization & History",
    category: "History",
    match: ["history"],
    variant: "side",
    theme: "plumSoft",
    span: "sm:col-span-1 lg:col-span-3",
    minH: "min-h-[250px]",
    unit: "Titles",
    desc: "Faded imperial annals, cartographic breakthroughs, archival excavations, and the turning points of nations.",
    chips: ["Antiquity", "Modern Era"],
  },
];

/* ---------- index-jump chips ---------- */

const GROUPS = [
  { label: "All Genres", ids: null },
  {
    label: "Literary & Speculative",
    ids: ["literary", "romance", "fantasy", "thriller"],
  },
  {
    label: "Human Histories",
    ids: ["nonfiction", "biography", "history"],
  },
  {
    label: "Inquiry & Logic",
    ids: ["science", "mystery", "nonfiction"],
  },
  {
    label: "Introspection & Life",
    ids: ["reflection", "biography", "romance"],
  },
];

/* ---------- small building blocks ---------- */

const Cover = ({ book, title, className = "" }) =>
  book?.image ? (
    <img
      src={
        book.image.startsWith("http")
          ? book.image
          : `${API_URL}${book.image.startsWith("/") ? "" : "/"}${book.image}`
      }
      alt={book.title}
      className={`object-cover rounded-sm shadow-[0_14px_22px_rgba(43,34,48,0.28)] ${className}`}
    />
  ) : (
    <div
      className={`rounded-sm bg-[#e8ddd8]/70 border border-black/5 flex items-center justify-center text-center p-2 serif text-base leading-tight text-[#8c7f8a] ${className}`}
    >
      {book?.title || title}
    </div>
  );

const Eyebrow = ({ number, className = "" }) => (
  <p className={`text-base tracking-wider uppercase leading-tight ${className}`}>
    <span className="block">Shelving</span>
    <span className="block">{number}</span>
  </p>
);

const ShelfCard = ({ shelf, number, count, covers, dimmed, onOpen }) => {
  const t = THEMES[shelf.theme];
  const unit = count === 1 ? shelf.unit.slice(0, -1) : shelf.unit;
  const countLabel = `${count} ${unit}`;

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      className={`group relative rounded-xl p-6 flex flex-col overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(60,20,60,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5a2458] ${shelf.span} ${shelf.minH} ${t.card} ${dimmed ? "opacity-40" : ""}`}
    >
      {/* ---------- FEATURE (Literary Fiction) ---------- */}
      {shelf.variant === "feature" && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 75% 35%, rgba(250,228,250,0.55), transparent 55%)",
            }}
          />

          <div className="relative flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Eyebrow number={number} className={t.eyebrow} />
              <span className={`text-base mt-0.5 ${t.count}`}>
                • {countLabel}
              </span>
            </div>

            <span
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors group-hover:bg-[#5a2458] group-hover:text-white ${t.arrowBtn}`}
            >
              <Icon name="arrow" className="w-4 h-4" />
            </span>
          </div>

          <h3
            className={`relative serif text-4xl mt-2 tracking-tight ${t.title}`}
          >
            {shelf.title}
          </h3>

          <p
            className={`relative text-base leading-relaxed mt-3 max-w-sm ${t.desc}`}
          >
            {shelf.desc}
          </p>

          <div className="relative flex-1 flex items-end mt-6">
            <div className="flex items-end -space-x-6 pl-2">
              {(covers.length ? covers : [null]).map((book, i) => (
                <Cover
                  key={book?._id || i}
                  book={book}
                  title={shelf.title}
                  className={`w-[104px] h-[150px] ${["-rotate-6", "rotate-0 z-10", "rotate-6"][i]}`}
                />
              ))}
            </div>

            <span
              className={`ml-auto text-base font-medium flex items-center gap-1.5 ${t.link}`}
            >
              Enter Shelf
              <Icon name="arrow" className="w-3.5 h-3.5" />
            </span>
          </div>
        </>
      )}

      {/* ---------- STACK (cover centred) ---------- */}
      {shelf.variant === "stack" && (
        <>
          <div className="flex items-start justify-between">
            <Eyebrow number={number} className={t.eyebrow} />
            <span className={`text-base ${t.count}`}>{countLabel}</span>
          </div>

          <div className="flex items-start justify-between gap-2 mt-2">
            <h3
              className={`serif tracking-tight ${shelf.titleSize} ${t.title}`}
            >
              {shelf.title}
            </h3>

            {shelf.titleIcon && (
              <Icon
                name={shelf.titleIcon}
                className={`w-4 h-4 mt-2 shrink-0 ${t.count}`}
              />
            )}
          </div>

          <p className={`text-base leading-relaxed mt-3 ${t.desc}`}>
            {shelf.desc}
          </p>

          <div className="flex-1 flex items-center justify-center py-6">
            <Cover
              book={covers[0]}
              title={shelf.title}
              className="w-[112px] h-[164px] transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {shelf.strongFoot ? (
            <div className="flex items-end justify-between">
              <span className="text-base tracking-wider text-white uppercase font-semibold leading-tight w-16">
                {shelf.tag}
              </span>

              <span className="text-base text-white font-semibold flex items-center gap-1.5">
                Browse
                <Icon name="arrow" className="w-3.5 h-3.5" />
              </span>
            </div>
          ) : (
            <div className={`flex items-center justify-between text-base ${t.foot}`}>
              <span>{shelf.tag}</span>
              <Icon
                name="arrow"
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
              />
            </div>
          )}
        </>
      )}

      {/* ---------- SIDE (cover on the right) ---------- */}
      {shelf.variant === "side" && (
        <>
          <div className="relative flex-1">
            <div className="flex items-start gap-3">
              <Eyebrow number={number} className={t.eyebrow} />
              <span className={`text-base mt-0.5 ${t.count}`}>
                • {countLabel}
              </span>
            </div>

            <h3 className={`serif text-3xl mt-2 tracking-tight ${t.title}`}>
              {shelf.title}
            </h3>

            <p
              className={`text-base leading-relaxed mt-3 max-w-[230px] ${t.desc}`}
            >
              {shelf.desc}
            </p>

            <Cover
              book={covers[0]}
              title={shelf.title}
              className="absolute right-0 top-0 w-[84px] h-[124px] transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div className="flex gap-2">
              {shelf.chips.map((chip) => (
                <span
                  key={chip}
                  className={`text-base font-medium px-2.5 py-1 rounded-md ${t.chip}`}
                >
                  {chip}
                </span>
              ))}
            </div>

            <span
              className={`text-base font-semibold flex items-center gap-1.5 ${t.link}`}
            >
              Browse
              <Icon name="arrow" className="w-3.5 h-3.5" />
            </span>
          </div>
        </>
      )}
    </article>
  );
};

/* ---------- page ---------- */

const Categories = () => {
  const [books, setBooks] = useState([]);
  const [activeGroup, setActiveGroup] = useState("All Genres");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  /* ---------- fetch books ---------- */

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/books`);
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  /* ---------- category matching ---------- */

  const booksForShelf = (shelf) =>
    books.filter((book) => {
      const category = String(book.category || "")
        .toLowerCase()
        .trim();

      return shelf.match.some((match) => category === match);
    });

  /* ---------- index-jump dimming ---------- */

  const activeIds = GROUPS.find((g) => g.label === activeGroup)?.ids;

  const isDimmed = (shelfId) =>
    activeIds ? !activeIds.includes(shelfId) : false;

  /* ---------- curator's cross-examination books ---------- */

  const withImages = books.filter((book) => book.image);
  const salonBooks = (withImages.length >= 2 ? withImages : books).slice(0, 2);

  const bookYear = (book) =>
    book.year ||
    book.publishedYear ||
    (book.createdAt ? new Date(book.createdAt).getFullYear() : null);

  /* ---------- newsletter ---------- */

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2b2230] font-['Plus_Jakarta_Sans',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .serif {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      <Navbar />

      {/* ================= HEADER ================= */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        

        <div className="mt-1 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="serif text-5xl lg:text-6xl leading-[1.1] tracking-tight text-[#5a2458]">
              Find your kind of story.
            </h1>

            <p className="mt-4 text-base text-[#4a4050] leading-relaxed max-w-md">
              Explore curated bookshelves spanning literary fiction, deep
              human histories, speculative worlds, and timeless essays.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-[#f4f0ec] rounded-xl px-6 py-5 self-start lg:self-auto">
            <div>
              <p className="serif text-3xl text-[#5a2458] leading-none">
                {books.length.toLocaleString()}
              </p>
              <p className="text-base tracking-wider uppercase text-[#7b6f7b] mt-2">
                Indexed Volumes
              </p>
            </div>

            <span className="w-px h-10 bg-[#ddd3d9]" />

            <div>
              <p className="serif text-3xl text-[#5a2458] leading-none">
                {SHELVES.length}
              </p>
              <p className="text-base tracking-wider uppercase text-[#7b6f7b] mt-2">
                Curated Salons
              </p>
            </div>
          </div>
        </div>

        {/* Index jump */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-base tracking-wider uppercase text-[#7b6f7b] leading-tight w-14">
              Index Jump:
            </p>

            {GROUPS.map((group) => {
              const isActive = activeGroup === group.label;

              return (
                <button
                  key={group.label}
                  onClick={() => setActiveGroup(group.label)}
                  className={`text-base px-4 py-2 rounded-full transition-colors ${
                    isActive
                      ? "bg-[#4a1d49] text-white font-semibold"
                      : "bg-[#efeae5] text-[#5b4f5b] hover:bg-[#e6dde4]"
                  }`}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ================= SHELVES ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-9">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {SHELVES.map((shelf, i) => {
            const shelfBooks = booksForShelf(shelf);

            return (
              <ShelfCard
                key={shelf.id}
                shelf={shelf}
                number={String(i + 1).padStart(2, "0")}
                count={shelfBooks.length}
                covers={shelfBooks
                  .filter((book) => book.image?.trim())
                  .slice(0, 3)}
                dimmed={isDimmed(shelf.id)}
                onOpen={() =>
                  navigate(
                    `/explore?category=${encodeURIComponent(shelf.category)}`
                  )
                }
              />
            );
          })}
        </div>
      </section>

      {/* ================= CURATOR'S CROSS-EXAMINATION ================= */}
      <section
        id="salon-selects"
        className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 mb-10"
      >
        <div className="relative overflow-hidden rounded-3xl bg-[#f4f0ec] p-8 lg:p-12">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 90% 100%, rgba(250,220,250,0.6), transparent 45%)",
            }}
          />

          <div className="relative grid lg:grid-cols-[1fr_1.5fr] gap-10 items-center">
            {/* Left copy */}
            <div>
              <span className="inline-flex items-start gap-2 text-base tracking-wider uppercase bg-[#e5e1dc] text-[#4a4050] px-3 py-1.5 rounded-full max-w-[220px] leading-tight">
                <Icon name="book" className="w-3 h-3 mt-0.5 shrink-0" />
                Curator's monthly cross-examination
              </span>

              <h2 className="serif text-4xl lg:text-5xl leading-[1.15] mt-5 text-[#5a2458]">
                When Moral Philosophy Collides with Modern Fiction.
              </h2>

              <p className="mt-6 text-base text-[#4a4050] leading-relaxed">
                This month, our literary salon pairs two foundational voices
                investigating how consciousness navigates crisis,
                responsibility, and the quiet dignity of perseverance.
              </p>

             
            </div>

            {/* Right cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {salonBooks.map((book) => {
                const year = bookYear(book);

                return (
                  <article
                    key={book._id}
                    onClick={() => navigate(`/book/${book._id}`)}
                    className="bg-white rounded-xl border border-[#efe9e4] p-3 cursor-pointer flex flex-col shadow-[0_8px_24px_rgba(60,20,60,0.06)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-[330px] rounded-md overflow-hidden bg-[#ece7e1]">
                      {book.image ? (
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-[#a99fa9] text-base">
                          No Image
                        </div>
                      )}

                      {book.category && (
                        <span className="absolute top-3 left-3 bg-[#4a1d49] text-white text-base tracking-wider uppercase px-2 py-1 rounded">
                          {book.category}
                        </span>
                      )}
                    </div>

                    <div className="px-1 pt-4 flex-1 flex flex-col">
                      <h3 className="serif text-xl text-[#3b2939] leading-snug">
                        {book.title}
                      </h3>

                      <p className="text-base text-[#6b5f6b] mt-1.5">
                        {[book.author, year].filter(Boolean).join(", ")}
                      </p>

                      <p className="text-base text-[#7b6f7b] leading-relaxed mt-3 line-clamp-3">
                        {book.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-[#efe9e4] flex items-center justify-between">
                        <p className="text-base tracking-wider uppercase text-[#7b6f7b] leading-tight">
                          Critical Rating:
                          <br />
                          <span className="text-base font-semibold text-[#5a2458] normal-case tracking-normal">
                            {book.rating ? `${book.rating}/5` : "—"}
                          </span>
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/book/${book._id}`);
                          }}
                          className="text-base font-semibold text-[#5a2458] flex items-center gap-1 hover:underline"
                        >
                          Read 
                          <Icon name="arrow" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default Categories;
