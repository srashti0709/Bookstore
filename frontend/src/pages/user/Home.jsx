import { API_BASE_URL } from "../../api";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import libraryHeroBg from "../../assets/library-hero-bg.png";
import openBookImage from "../../assets/open-book.png";
/* ---------- Tiny inline icon set ---------- */

const ICONS = {
  search: "M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  left: "M15 18l-6-6 6-6",
  right: "M9 18l6-6-6-6",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  book: "M3 5h7a3 3 0 013 3v11a2 2 0 00-2-2H3zM21 5h-7a3 3 0 00-3 3v11a2 2 0 012-2h8z",
  compass:
    "M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z",
  bookmark: "M6 4h12v17l-6-4-6 4z",
  sliders: "M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4",
  heart: "M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
  brain:
    "M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 006 0V7a3 3 0 00-3-3zM15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-6 0",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  play: "M8 5v14l11-7z",
};

const Icon = ({
  name,
  className = "w-4 h-4",
  fill = false,
}) => (
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

/* ---------- Categories ---------- */

const CATEGORIES = [
  { name: "All Categories", icon: "book" },
  { name: "Fiction", icon: "book" },
  { name: "Non-Fiction", icon: "bookmark" },
  { name: "Romance", icon: "heart" },
  { name: "Fantasy", icon: "compass" },
  { name: "Thriller", icon: "brain" },
  { name: "Self-Help", icon: "user" },
  { name: "Biography", icon: "book" },
];

/* ---------- Philosophy ---------- */

const PHILOSOPHY = [
  {
    phase: "Phase 01",
    icon: "compass",
    title: "Discover",
    text: "Curated books based on your true interests, crafted by human critics, editors, and salon fellows rather than transactional algorithms.",
  },
  {
    phase: "Phase 02",
    icon: "book",
    title: "Read",
    text: "Read available books directly through our custom typographic viewer designed for seamless long-form immersion across any display.",
  },
  {
    phase: "Phase 03",
    icon: "bookmark",
    title: "Save",
    text: "Build your own personal library with bespoke shelves, quiet margin notes, and synchronized reading positions across devices.",
  },
  {
    phase: "Phase 04",
    icon: "sliders",
    title: "Personalize",
    text: "Discover books based on your reading history, cadence, and favorite philosophical periods as your intellectual taste evolves.",
  },
];

const Home = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("All Categories");
  const [email, setEmail] = useState("");
  const [featuredSlide, setFeaturedSlide] = useState(0);

  const navigate = useNavigate();
  const carouselRef = useRef(null);

  /* ---------- Fetch books ---------- */

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/books`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.books || [];

      setBooks(
        data.filter(
          (book) =>
            !book.status || book.status === "published"
        )
      );
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  /* ---------- Category matching ---------- */

  const matchesCategory = (book, category) => {
    if (category === "All Categories") {
      return true;
    }

    return (
      book.category &&
      String(book.category).toLowerCase() ===
      category.toLowerCase()
    );
  };

  /* ---------- Visible books ---------- */

  const visibleBooks = books.filter((book) => {
    const q = query.trim().toLowerCase();

    const textOk =
      !q ||
      [book.title, book.author, book.category].some(
        (value) =>
          value &&
          String(value).toLowerCase().includes(q)
      );

    const categoryOk = matchesCategory(
      book,
      activeChip
    );

    return textOk && categoryOk;
  });

  /* ---------- Featured book ---------- */

  const featured =
    books.find(
      (book) => book.accessType === "premium"
    ) || books[0];

  /*
   * Three books for the Featured Salon slider.
   * Slide 1 = featured book
   * Slide 2 = second book
   * Slide 3 = third book
   */

  const sliderBooks = featured
    ? [
      featured,
      ...books
        .filter((book) => book._id !== featured._id)
        .slice(0, 2),
    ]
    : [];

  /* ---------- Keep active slide valid ---------- */

  useEffect(() => {
    if (
      sliderBooks.length > 0 &&
      featuredSlide >= sliderBooks.length
    ) {
      setFeaturedSlide(0);
    }
  }, [sliderBooks.length, featuredSlide]);

  /* ---------- Auto-rotate featured slides ---------- */
  useEffect(() => {
    if (sliderBooks.length <= 1) return;

    const interval = setInterval(() => {
      setFeaturedSlide((current) =>
        (current + 1) % sliderBooks.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderBooks.length]);


  /* ---------- Book carousel ---------- */

  const scrollCarousel = (dir) => {
    carouselRef.current?.scrollBy({
      left: dir * 320,
      behavior: "smooth",
    });
  };

  /* ---------- Search ---------- */

  const handleSearch = (e) => {
    e.preventDefault();

    document
      .getElementById("noteworthy")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  /* ---------- Newsletter ---------- */

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  };

  /* ---------- Featured slider ---------- */

  const nextFeaturedSlide = () => {
    setFeaturedSlide((current) =>
      current === sliderBooks.length - 1
        ? 0
        : current + 1
    );
  };

  const previousFeaturedSlide = () => {
    setFeaturedSlide((current) =>
      current === 0
        ? sliderBooks.length - 1
        : current - 1
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2b2230] font-['Plus_Jakarta_Sans',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .serif {
          font-family: 'Playfair Display', Georgia, serif;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes salonFade {
          from {
            opacity: 0;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .salon-slide {
          animation: salonFade 0.35s ease-out;
        }

        @keyframes heroReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-reveal {
          animation: heroReveal 0.8s ease-out both;
        }

        .hero-reveal-delay {
          animation: heroReveal 0.9s 0.18s ease-out both;
        }

        .hero-reveal-late {
          animation: heroReveal 1s 0.32s ease-out both;
        }

        .hero-rule {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.7),
            rgba(255,255,255,0.08)
          );
        }

        .hero-glow {
          background: radial-gradient(
            ellipse at 18% 45%,
            rgba(90,36,88,0.28),
            transparent 55%
          );
        }
      `}</style>

      {/* ================= HERO ================= */}




      <section className="relative isolate overflow-hidden bg-[#211a25] text-white">
        {/* Background Image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${libraryHeroBg})` }}
        />

        {/* Layered Overlays */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#17121c]/95 via-[#211621]/80 to-[#211621]/55" />
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

        {/* Decorative Ambient Glow */}
        <div
          aria-hidden="true"
          className="absolute -z-10 right-[-10%] top-1/4 h-[300px] w-[300px] rounded-full bg-[#8a477e]/20 blur-[100px] sm:right-[5%] sm:h-[450px] sm:w-[450px]"
        />

        {/* Navbar */}
        <Navbar />

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-12 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 xl:gap-16">
            {/* LEFT: Hero Content */}
            <div className="mx-auto w-full max-w-2xl lg:mx-0">
              <div className="mb-6 flex items-center gap-3 sm:mb-7">
                <span className="h-px w-9 shrink-0 bg-[#d9a9d2]" />

                <span className="text-base font-medium uppercase tracking-[0.12em] text-[#ead3e7] sm:tracking-[0.2em]">
                  The Independent Reading Room
                </span>
              </div>

              <h1 className="serif text-5xl leading-[1.08] tracking-[-0.035em] text-[#faf8f4] sm:text-6xl lg:text-7xl xl:text-[76px]">
                Stories worth
                <br />
                <span className="font-normal italic text-[#e8cce4]">
                  getting lost in.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-[1.9] text-[#eee5ec] sm:mt-7 sm:text-lg">
                Discover timeless classics, new voices, and stories curated for
                every kind of reader. Find your next favorite book in a quieter,
                more thoughtful corner of the literary world.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col items-stretch gap-4 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("books-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-[#6b2d63] px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#562450] sm:px-7"
                >
                  Explore the Collection

                  <Icon
                    name="arrow"
                    className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/library")}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg border border-white/40 bg-white/[0.08] px-6 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 sm:px-7"
                >
                  <Icon name="bookmark" className="h-5 w-5 shrink-0" />
                  My Library
                </button>
              </div>

              {/* Editorial Signature */}
              <div className="mt-8 flex items-start gap-3 text-base leading-relaxed text-[#d8c7d5] sm:mt-10">
                <Icon
                  name="book"
                  className="mt-1 h-5 w-5 shrink-0 text-[#d9a9d2]"
                />

                <span>Read slowly. Discover deeply. Remember forever.</span>
              </div>
            </div>

            {/* RIGHT: Editorial Reading Feature */}
            <div className="relative mx-auto flex min-h-[400px] w-full max-w-[540px] items-center justify-center sm:min-h-[470px] md:min-h-[510px] lg:min-h-[510px]">
              {/* Decorative Rings */}
              <div className="absolute h-[250px] w-[250px] rounded-full border border-white/15 sm:h-[340px] sm:w-[340px] lg:h-[410px] lg:w-[410px]" />

              <div className="absolute h-[210px] w-[210px] rounded-full border border-white/10 sm:h-[285px] sm:w-[285px] lg:h-[350px] lg:w-[350px]" />

              <div className="absolute h-[170px] w-[170px] rounded-full border border-white/10 bg-gradient-to-br from-[#8a477e]/35 via-[#6b2d63]/15 to-transparent backdrop-blur-sm sm:h-[230px] sm:w-[230px] lg:h-[280px] lg:w-[280px]" />

              {/* Center Open-Book Image */}
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <img
                  src={openBookImage}
                  alt="An elegant open book"
                  className="h-[90%] w-[95%] scale-105 object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.4)] sm:scale-110"
                />
              </div>

              {/* Floating Editorial Card */}
              <div className="absolute left-0 top-[4%] z-20 w-[min(225px,58%)] rounded-xl border border-white/15 bg-[#251c29]/80 p-4 shadow-2xl backdrop-blur-xl sm:left-0 sm:top-[7%] sm:p-5 lg:left-2">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#d9a9d2]" />

                  <span className="text-base font-medium uppercase tracking-[0.1em] text-[#dfc6dc]">
                    The art of reading
                  </span>
                </div>

                <p className="serif text-xl leading-snug text-[#faf3f9] sm:text-2xl">
                  Every book opens a door to another world.
                </p>

                <div className="mt-4 h-px w-10 bg-[#d9a9d2]" />
              </div>




              {/* Top-Right Label */}
              <div className="absolute right-0 top-[12%] hidden text-right sm:block">
                <p className="text-base uppercase tracking-[0.12em] text-[#e8cce4]/80">
                  A world between
                </p>

                <p className="serif mt-1 text-xl italic text-white/90">
                  the covers
                </p>
              </div>

              {/* Bottom-Left Decorative Label */}
              <div className="absolute bottom-[10%] left-0 hidden items-center gap-3 sm:flex sm:left-[2%]">
                <span className="h-px w-8 bg-[#d9a9d2]/70" />

                <span className="text-base uppercase tracking-[0.12em] text-[#e8cce4]/80">
                  Turn the page
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Information Strip */}
          <div className="mt-10 grid grid-cols-1 gap-5 border-t border-white/20 pt-6 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.07]">
                <Icon name="book" className="h-6 w-6 text-[#e8cce4]" />
              </span>

              <div>
                <p className="text-base font-semibold sm:text-lg">
                  A world of stories
                </p>

                <p className="mt-1 text-base leading-relaxed text-[#d7cbd5]">
                  Across genres and generations
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.07]">
                <Icon name="compass" className="h-6 w-6 text-[#e8cce4]" />
              </span>

              <div>
                <p className="text-base font-semibold sm:text-lg">
                  Discover your next read
                </p>

                <p className="mt-1 text-base leading-relaxed text-[#d7cbd5]">
                  Explore your reading interests
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-1">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.07]">
                <Icon name="bookmark" className="h-6 w-6 text-[#e8cce4]" />
              </span>

              <div>
                <p className="text-base font-semibold sm:text-lg">
                  Your personal library
                </p>

                <p className="mt-1 text-base leading-relaxed text-[#d7cbd5]">
                  Keep your favorite stories close
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ================= CATEGORIES ================= */}


      {/* CATEGORIES SECTION */}
      <section
        id="categories"
        className="relative isolate overflow-hidden bg-[#f6f0f5] py-20 sm:py-24"
      >
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#e8d4e7]/60 blur-[100px] animate-[categoryGlow_9s_ease-in-out_infinite]" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#e5d5e8]/60 blur-[110px] animate-[categoryGlow_11s_ease-in-out_infinite_reverse]" />
          <div className="absolute inset-0 bg-[radial-gradient(#6b2d63_0.7px,transparent_0.7px)] [background-size:24px_24px] opacity-[0.09]" />
          <div className="absolute left-[8%] top-[28%] h-2 w-2 rounded-full bg-[#b78ab4]/60 animate-[categoryParticle_7s_ease-in-out_infinite]" />
          <div className="absolute right-[12%] top-[18%] h-3 w-3 rounded-full border border-[#9d6a99]/40 animate-[categoryParticle_9s_ease-in-out_infinite_1s]" />
          <div className="absolute bottom-[15%] left-[46%] h-2 w-2 rounded-full bg-[#c4a0c1]/70 animate-[categoryParticle_8s_ease-in-out_infinite_2s]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section heading */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="animate-[categoryReveal_0.8s_ease-out_both]">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-[#8e5489]" />
                <p className="text-base font-semibold uppercase tracking-[0.22em] text-[#6b2d63]">
                  Categorical taxonomy
                </p>
                <span className="h-px w-10 bg-[#8e5489]/40" />
              </div>

              <h2 className="serif text-4xl leading-tight tracking-tight text-[#4a2745] sm:text-5xl lg:text-6xl">
                Explore by{" "}
                <span className="relative inline-block italic text-[#85527f]">
                  Category
                  <span className="absolute -bottom-2 left-0 h-[3px] w-full origin-left scale-x-0 rounded-full bg-[#b58aaf] animate-[categoryUnderline_1s_ease-out_0.5s_forwards]" />
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#786778] sm:text-lg">
                Every genre opens a different door. Find the stories,
                ideas, and worlds that speak to you.
              </p>
            </div>

            {/* Editorial side note */}
            <div className="max-w-xs border-l-2 border-[#c6a4c3] pl-5 animate-[categoryReveal_0.8s_ease-out_0.2s_both] md:mb-2">
              <p className="serif text-xl italic text-[#6b2d63]">
                A library of possibilities.
              </p>
              <p className="mt-2 text-base leading-6 text-[#857585]">
                From familiar favorites to unexpected discoveries,
                your next read starts here.
              </p>
            </div>
          </div>

          {/* Category cards */}
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => {
              const count =
                cat.name === "All Categories"
                  ? books.length
                  : books.filter((book) =>
                    matchesCategory(book, cat.name)
                  ).length;

              const isActive = activeChip === cat.name;

              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveChip(cat.name);
                    document
                      .getElementById("noteworthy")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                  style={{
                    animationDelay: `${0.12 + i * 0.12}s`,
                  }}
                  className={`group relative isolate flex h-48 flex-col justify-between overflow-hidden rounded-2xl border p-6 text-left transition-all duration-500 ease-out animate-[categoryReveal_0.75s_ease-out_both] hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(74,39,69,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#85527f] focus-visible:ring-offset-4 ${isActive
                    ? "border-[#875280] bg-white shadow-[0_14px_35px_rgba(74,39,69,0.12)]"
                    : "border-[#e8dce7] bg-white/75 shadow-[0_5px_20px_rgba(74,39,69,0.035)] hover:border-[#c5a0c2] hover:bg-white"
                    }`}
                >
                  {/* Animated card glow */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-[#ead8e9] blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-[#dfc1dd] ${isActive ? "scale-125 opacity-80" : "opacity-35"
                      }`}
                  />

                  {/* Subtle bottom gradient */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#f2e6f1] to-transparent transition-opacity duration-500 ${isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                      }`}
                  />

                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <span
                      className={`relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110 ${isActive
                        ? "bg-[#5a2458] text-white shadow-lg shadow-[#5a2458]/20"
                        : "bg-[#f1e6f0] text-[#6b2d6b] group-hover:bg-[#5a2458] group-hover:text-white"
                        }`}
                    >
                      <Icon
                        name={cat.icon}
                        className="h-5 w-5 transition-transform duration-500 group-hover:scale-110"
                      />
                    </span>

                    <span
                      className={`font-mono text-base tracking-wider transition-colors duration-300 ${isActive
                        ? "text-[#875280]"
                        : "text-[#b5a5b4] group-hover:text-[#875280]"
                        }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Category information */}
                  <div className="relative">
                    <h3
                      className={`serif text-2xl leading-tight transition-all duration-300 group-hover:translate-x-1 sm:text-[26px] ${isActive
                        ? "text-[#5a2458]"
                        : "text-[#4a2745] group-hover:text-[#6b2d63]"
                        }`}
                    >
                      {cat.name}
                    </h3>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-base text-[#857585] transition-colors duration-300 group-hover:text-[#6b4a68]">
                        {count} {count === 1 ? "title" : "titles"} available
                      </p>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isActive
                          ? "translate-x-0 bg-[#5a2458] text-white"
                          : "translate-x-2 bg-[#f0e4ef] text-[#6b2d63] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                      >
                        <Icon name="arrow" className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  {/* Active indicator */}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 h-[3px] rounded-r-full bg-gradient-to-r from-[#5a2458] via-[#a66a9f] to-[#d9b5d5] transition-all duration-500 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Bottom editorial footer */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#dfd0de] pt-6 animate-[categoryReveal_0.8s_ease-out_0.5s_both]">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#8b5486] shadow-[0_0_12px_rgba(139,84,134,0.45)]" />
              <p className="text-base text-[#786778]">
                <span className="font-semibold text-[#5a2458]">
                  {books.length}
                </span>{" "}
                stories waiting to be discovered
              </p>
            </div>

            <p className="serif text-base italic text-[#8a7188]">
              Read slowly. Wander freely.
            </p>
          </div>
        </div>

        {/* Section-specific animations */}
        <style>{`
    @keyframes categoryReveal {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes categoryGlow {
      0%, 100% {
        transform: translate3d(0, 0, 0) scale(1);
      }
      50% {
        transform: translate3d(20px, -18px, 0) scale(1.12);
      }
    }

    @keyframes categoryParticle {
      0%, 100% {
        transform: translate3d(0, 0, 0);
        opacity: 0.4;
      }
      50% {
        transform: translate3d(0, -20px, 0);
        opacity: 1;
      }
    }

    @keyframes categoryUnderline {
      to {
        transform: scaleX(1);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #categories *,
      #categories *::before,
      #categories *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
      }
    }
  `}</style>
      </section>


      {/* ================= NEW & NOTEWORTHY ================= */}

<section
  id="noteworthy"
  className="relative isolate mx-auto w-full max-w-7xl overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24"
>
  {/* Soft editorial background accents */}
  <div className="pointer-events-none absolute right-0 top-12 -z-10 h-48 w-48 rounded-full bg-[#e8d5e7]/35 blur-3xl sm:h-72 sm:w-72" />
  <div className="pointer-events-none absolute bottom-0 left-1/4 -z-10 h-40 w-40 rounded-full bg-[#f2dfe8]/40 blur-3xl sm:h-56 sm:w-56" />

  {/* Section heading */}
  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0 animate-[noteworthyReveal_0.7s_ease-out_both]">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px w-9 shrink-0 bg-[#8b5b83]" />
        <p className="text-base font-semibold uppercase tracking-[0.15em] text-[#6b2d63] sm:tracking-[0.2em]">
          {activeChip === "All Categories"
            ? "Editor's selection"
            : `${activeChip} collection`}
        </p>
      </div>

      <h2 className="serif text-3xl leading-tight text-[#4a2745] sm:text-4xl md:text-5xl lg:text-6xl">
        {activeChip === "All Categories"
          ? "New & Noteworthy"
          : `${activeChip} Books`}
        <span className="text-[#9a7095]">.</span>
      </h2>

      <p className="mt-3 max-w-xl text-base leading-relaxed text-[#786778] sm:text-lg">
        Discover stories to keep, ideas to explore, and pages worth getting lost in.
      </p>
    </div>

    {/* Carousel controls */}
    <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto sm:justify-end">
      <span className="mr-2 hidden text-base tracking-wide text-[#8a7888] md:block">
        Explore the collection
      </span>

      <button
        type="button"
        onClick={() => scrollCarousel(-1)}
        aria-label="Previous books"
        className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e5d8e3] bg-white/80 text-[#5a2458] shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#5a2458] hover:bg-[#5a2458] hover:text-white hover:shadow-[0_8px_24px_rgba(90,36,88,0.2)] active:scale-95 sm:h-12 sm:w-12"
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
          <Icon name="left" className="h-5 w-5" />
        </span>
      </button>

      <button
        type="button"
        onClick={() => scrollCarousel(1)}
        aria-label="Next books"
        className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#5a2458] bg-[#5a2458] text-white shadow-md transition-all duration-300 hover:border-[#713b6c] hover:bg-[#713b6c] hover:shadow-[0_8px_24px_rgba(90,36,88,0.24)] active:scale-95 sm:h-12 sm:w-12"
      >
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          <Icon name="right" className="h-5 w-5" />
        </span>
      </button>
    </div>
  </div>

  {/* Subtle divider */}
  <div className="mt-7 h-px w-full bg-gradient-to-r from-[#c8a9c4] via-[#e9dfe7] to-transparent sm:mt-8" />

  {/* Empty state */}
  {visibleBooks.length === 0 ? (
    <div className="mt-8 rounded-2xl border border-dashed border-[#dfd0dd] bg-white/60 px-4 py-12 text-center sm:mt-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1e7f0] text-[#6b2d63]">
        <Icon name="book-open" className="h-7 w-7" />
      </div>

      <h3 className="serif mt-5 text-xl text-[#4a2745] sm:text-2xl">
        No stories here just yet
      </h3>

      <p className="mt-2 text-base text-[#7b6f7b]">
        No books available in this category.
      </p>
    </div>
  ) : (
    <div
      ref={carouselRef}
      className="no-scrollbar -mx-4 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-7 pt-2 sm:mx-0 sm:mt-9 sm:gap-6 sm:px-0 sm:pb-8 lg:gap-7"
    >
      {visibleBooks.map((book, index) => (
        <article
          key={book._id}
          onClick={() => navigate(`/book/${book._id}`)}
          style={{ animationDelay: `${Math.min(index, 8) * 90}ms` }}
          className="noteworthy-card group w-[min(78vw,260px)] shrink-0 snap-start cursor-pointer rounded-2xl border border-[#ebe3e9] bg-white/80 p-3 shadow-[0_4px_18px_rgba(74,39,69,0.035)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d5bfd3] hover:bg-white hover:shadow-[0_20px_45px_rgba(74,39,69,0.12)] sm:w-[280px]"
        >
          {/* Book cover */}
          <div className="relative h-[280px] overflow-hidden rounded-xl bg-[#f1eee8] sm:h-[330px]">
            {book.image ? (
              <img
                src={book.image}
                alt={book.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#f5eff4] via-[#f1eee8] to-[#e8dce8] text-[#a99fa9]">
                <Icon name="book-open" className="h-10 w-10" />
                <span className="text-base tracking-wide">
                  Cover unavailable
                </span>
              </div>
            )}

            {/* Cover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#281326]/50 via-transparent to-[#281326]/10 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Access badge */}
            <span
              className={`absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-full px-2.5 py-1.5 text-base font-semibold tracking-wide shadow-sm backdrop-blur-md sm:left-3 sm:top-3 sm:px-3 ${
                book.accessType === "premium"
                  ? "border border-[#f0d8a5]/50 bg-[#f4e5c9]/95 text-[#65451e]"
                  : "border border-white/60 bg-white/90 text-[#5a2458]"
              }`}
            >
              {book.accessType === "premium"
                ? "Premium Access"
                : "Free to Read"}
            </span>

            {/* Hover action */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#3f1d3d]/30 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/book/${book._id}`);
                }}
                className="translate-y-3 rounded-full bg-white px-4 py-3 text-base font-semibold text-[#5a2458] shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#f8f2f7] group-hover:translate-y-0 sm:px-6"
              >
                <span className="flex items-center gap-2">
                  {book.accessType === "free" ? "Read Book" : "View Book"}
                  <Icon name="right" className="h-4 w-4" />
                </span>
              </button>
            </div>

            {/* Decorative bottom line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#d7b4d2] transition-all duration-500 group-hover:w-full" />
          </div>

          {/* Book details */}
          <div className="px-1 pb-2 pt-4">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-base font-semibold uppercase tracking-[0.08em] text-[#8a6685] sm:tracking-[0.13em]">
                {book.category}
              </p>

              {book.rating != null && book.rating !== "" && (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#f8f2e7] px-2 py-1 text-base font-semibold text-[#765323] sm:gap-1.5 sm:px-2.5">
                  <Icon
                    name="star"
                    className="h-4 w-4 text-[#c18a36]"
                    fill
                  />
                  {book.rating}
                </span>
              )}
            </div>

            <h3 className="serif mt-2 line-clamp-2 text-xl leading-snug text-[#4a2745] transition-colors duration-300 group-hover:text-[#8a4b80] sm:text-2xl">
              {book.title}
            </h3>

            <p className="mt-1.5 truncate text-base text-[#796b79]">
              by {book.author}
            </p>

            <p className="mt-3 line-clamp-2 min-h-[3rem] text-base leading-relaxed text-[#7b6f7b]">
              {book.description}
            </p>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#f0e8ef] pt-3">
              <span className="min-w-0 text-base font-medium text-[#9a8798]">
                {book.accessType === "free"
                  ? "Open access"
                  : "Member edition"}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/book/${book._id}`);
                }}
                className="inline-flex shrink-0 items-center gap-1.5 text-base font-semibold text-[#5a2458] transition-all duration-300 hover:gap-2.5 hover:text-[#8a4b80]"
              >
                {book.accessType === "free" ? "Read" : "View"}
                <Icon name="right" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )}

  {/* Collection footer */}
  {visibleBooks.length > 0 && (
    <div className="mt-1 flex flex-col items-start justify-between gap-3 border-t border-[#e9dfe7] pt-5 sm:flex-row sm:items-center">
      <p className="text-base text-[#817181]">
        Curated with care, one page at a time.
      </p>

      <span className="inline-flex items-center gap-2 rounded-full bg-[#f1e7f0] px-4 py-2 text-base font-semibold text-[#6b2d63]">
        <span className="h-2 w-2 rounded-full bg-[#8a4b80]" />
        {visibleBooks.length}{" "}
        {visibleBooks.length === 1 ? "book" : "books"} to discover
      </span>
    </div>
  )}

  <style>{`
    @keyframes noteworthyReveal {
      from {
        opacity: 0;
        transform: translateY(18px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .noteworthy-card {
      animation: noteworthyReveal 0.65s ease-out both;
    }

    @media (prefers-reduced-motion: reduce) {
      .noteworthy-card {
        animation: none;
      }

      .noteworthy-card,
      .noteworthy-card * {
        transition-duration: 0.01ms !important;
      }
    }
  `}</style>
</section>




      {/* ================= FEATURED FROM THE SALON ================= */}



      {featured && sliderBooks.length > 0 && (
        <section className="relative isolate overflow-hidden bg-[#4a1d49] py-20 lg:py-24 text-white">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -top-32 -right-20 h-96 w-96 rounded-full bg-[#9d6397]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#a56d91]/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            {/* Section heading */}
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="flex items-center gap-3 text-base font-semibold uppercase tracking-[0.2em] text-[#e5c8e3]">
                  <Icon name="book" className="h-5 w-5" />
                  Digital Reading Rooms
                </p>

                <h2 className="serif mt-3 text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  Stories in the Spotlight
                  <span className="text-[#d9afd4]">.</span>
                </h2>
              </div>

              <p className="max-w-md text-lg leading-relaxed text-[#d9bfd8] md:text-right">
                A rotating selection of stories, ideas, and voices worth spending
                a little more time with.
              </p>
            </div>

            {/* Featured slide */}
            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#f7f1eb] text-[#2b2230] shadow-[0_30px_90px_rgba(15,5,18,0.28)]">
              {sliderBooks.map((book, index) => {
                if (index !== featuredSlide) return null;

                const slideLabel =
                  index === 0
                    ? "Popular Read"
                    : index === 1
                      ? "Reader's Choice"
                      : "New in the Collection";

                return (
                  <div
                    key={book._id}
                    className="salon-slide grid min-h-[460px] items-center gap-9 p-7 sm:p-10 lg:grid-cols-[280px_1fr] lg:gap-14 lg:p-14"
                  >
                    {/* Book cover */}
                    <div className="relative mx-auto w-[210px] sm:w-[240px] lg:w-[260px]">
                      <div className="absolute -inset-3 rounded-2xl bg-[#8b5b83]/15 blur-xl" />

                      <div className="relative h-[290px] overflow-hidden rounded-lg bg-[#e8ddd8] shadow-[0_24px_50px_rgba(43,34,48,0.24)] transition-transform duration-500 hover:-translate-y-2 sm:h-[330px]">
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-3 text-[#9c8f98]">
                            <Icon name="book" className="h-12 w-12" />
                            <span className="text-lg">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Cover decoration */}
                    </div>

                    {/* Book information */}
                    <div className="min-w-0">
                      <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#e2cfe0] bg-[#ead9e8] px-4 py-2 text-base font-semibold tracking-wide text-[#5a2458]">
                        <Icon name="bookmark" className="h-4 w-4" />
                        {slideLabel}
                        <span className="text-[#a17a9c]">·</span>
                        {book.category}
                      </span>

                      <h3 className="serif mt-5 text-4xl leading-tight text-[#3b2939] sm:text-5xl lg:text-6xl">
                        {book.title}
                      </h3>

                      <p className="mt-3 text-lg font-semibold uppercase tracking-[0.14em] text-[#7d6179]">
                        By {book.author}
                      </p>

                      {book.description && (
                        <blockquote className="serif mt-6 line-clamp-4 border-l-2 border-[#c8a4c4] pl-5 text-2xl italic leading-relaxed text-[#624e5f] sm:text-3xl">
                          “{book.description}”
                        </blockquote>
                      )}

                      {/* Access information */}
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold ${book.accessType === "premium"
                            ? "bg-[#f1e2c7] text-[#765323]"
                            : "bg-[#e2eee4] text-[#386449]"
                            }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          {book.accessType === "premium"
                            ? "Premium Access"
                            : "Free to Read"}
                        </span>
                      </div>

                      {/* Call-to-action buttons */}
                      <div className="mt-8 flex flex-wrap gap-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/book/${book._id}`)}
                          className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#5a2458] px-7 py-4 text-lg font-semibold text-white shadow-lg shadow-[#5a2458]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#713b6c] hover:shadow-xl active:translate-y-0"
                        >
                          Explore
                          <Icon
                            name="right"
                            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate("/library")}
                          className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#cdb8ca] bg-white/70 px-7 py-4 text-lg font-semibold text-[#5a2458] transition-all duration-300 hover:-translate-y-1 hover:border-[#5a2458] hover:bg-[#ead9e8] active:translate-y-0"
                        >
                          <Icon name="book" className="h-5 w-5" />
                          My Library
                          <Icon
                            name="right"
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slide indicators and navigation */}
            <div className="mt-7 flex items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                {sliderBooks.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFeaturedSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={featuredSlide === index ? "true" : undefined}
                    className={`h-3 rounded-full transition-all duration-300 ${featuredSlide === index
                      ? "w-10 bg-white"
                      : "w-3 bg-white/35 hover:bg-white/70"
                      }`}
                  />
                ))}

                <span className="ml-2 text-base tabular-nums text-white/70">
                  {String(featuredSlide + 1).padStart(2, "0")} /{" "}
                  {String(sliderBooks.length).padStart(2, "0")}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={previousFeaturedSlide}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/5 transition-all duration-300 hover:border-white/60 hover:bg-white/15 active:scale-95"
                  aria-label="Previous slide"
                >
                  <Icon name="left" className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={nextFeaturedSlide}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/5 transition-all duration-300 hover:border-white/60 hover:bg-white/15 active:scale-95"
                  aria-label="Next slide"
                >
                  <Icon name="right" className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Auto-rotation progress indicator */}

          </div>

          <style>{`
      @keyframes salonEnter {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes salonProgress {
        from { width: 0%; }
        to { width: 100%; }
      }

      .salon-slide {
        animation: salonEnter 0.55s ease-out both;
      }

      .salon-progress {
        animation: salonProgress 2s linear both;
      }

      @media (prefers-reduced-motion: reduce) {
        .salon-slide {
          animation: none;
        }

        .salon-progress {
          animation: none;
          width: 100%;
        }
      }
    `}</style>
        </section>
      )}


      {/* ================= WHY BOOKSTORE ================= */}

      
<section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
  <div className="text-center">
    <p className="text-base tracking-wider uppercase text-[#7b6f7b]">
      Our reading philosophy
    </p>

    <h2 className="serif text-5xl mt-2">
      Why Bookstore?
    </h2>

    <p className="text-base text-[#6b5f6b] mt-3 max-w-md mx-auto">
      A deliberate sanctuary built to liberate
      literature from algorithmic clutter and retail
      distractions.
    </p>
  </div>

  <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {PHILOSOPHY.map((p) => (
      <div
        key={p.title}
        className="bg-white rounded-xl border border-[#efe9e4] p-6"
      >
        <span className="w-10 h-10 rounded-md bg-[#f1e6f0] text-[#6b2d6b] flex items-center justify-center">
          <Icon
            name={p.icon}
            className="w-5 h-5"
          />
        </span>

        <p className="text-base tracking-wider uppercase text-[#7b6f7b] mt-6">
          {p.phase}
        </p>

        <h3 className="serif text-3xl mt-1">
          {p.title}
        </h3>

        <p className="text-base text-[#6b5f6b] leading-relaxed mt-3">
          {p.text}
        </p>
      </div>
    ))}
  </div>
</section>


      {/* ================= FOOTER ================= */}

      <Footer />
    </div>
  );
};

export default Home;
