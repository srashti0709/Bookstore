
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const About = () => {
  const [visible, setVisible] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    setVisible(true);

    const elements = pageRef.current?.querySelectorAll("[data-reveal]");
    if (!elements?.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) =>
        element.classList.add("about-visible")
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("about-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#faf8f4] text-[#4a2745]">
      {/* Keep shared Navbar typography independent */}
      <Navbar />

      {/* Page-specific typography is limited to the About content */}
      <main
        ref={pageRef}
        className="font-['Plus_Jakarta_Sans',sans-serif]"
      >
        {/* ================= HERO ================= */}
        <section className="relative isolate overflow-hidden border-b border-[#ebe6e6]">
          {/* Background decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[#f1e6f0]/80 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-36 -left-28 h-[380px] w-[380px] rounded-full bg-[#f2e6dc]/70 blur-3xl"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
            {/* Hero text */}
            <div
              className={`transition-all duration-1000 ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#e8dce6] bg-white/75 px-4 py-2.5 shadow-sm shadow-[#4a2745]/[0.02]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b58aa7] opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8b5480]" />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a5c77]">
                  The story behind Bookstore
                </span>
              </div>

              <h1 className="max-w-2xl font-['Playfair_Display',serif] text-5xl font-medium leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
                More than books.
                <span className="mt-2 block italic text-[#8b5480]">
                  A world of meaning.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#6b5f6b] sm:text-lg sm:leading-9">
                We believe the right book can change the way you see the
                world. Bookstore is a thoughtful space for curious minds,
                quiet moments, and stories worth getting lost in.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/library"
                  className="group inline-flex items-center gap-3 rounded-lg bg-[#562c50] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#562c50]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#6b2d63] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#8b5480]/25"
                >
                  Explore the collection

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                <a
                  href="#our-story"
                  className="group inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-[#6b2d63] transition-colors hover:bg-[#f1e6f0]"
                >
                  Our philosophy

                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-y-1"
                  >
                    ↓
                  </span>
                </a>
              </div>

              {/* Small editorial signature */}
              <div className="mt-12 flex items-center gap-4 border-t border-[#e8dfe7] pt-6">
                <div className="flex -space-x-2">
                  {["#8b5480", "#b58aa7", "#d4b4c8"].map(
                    (color, index) => (
                      <span
                        key={color}
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#faf8f4] text-xs font-semibold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {["B", "R", "S"][index]}
                      </span>
                    )
                  )}
                </div>

                <p className="text-sm leading-6 text-[#7a6877]">
                  For readers, dreamers,
                  <br className="sm:hidden" /> and the endlessly curious.
                </p>
              </div>
            </div>

            {/* Editorial book composition */}
            <div
              className={`relative mx-auto w-full max-w-lg transition-all delay-200 duration-1000 ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="relative aspect-[4/4.5] overflow-hidden rounded-2xl border border-[#e8dfe7] bg-[#f1e6f0] p-5 shadow-[0_24px_70px_rgba(74,39,69,0.07)] sm:p-8">
                {/* Pattern */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "radial-gradient(#bda7ba 0.7px, transparent 0.7px)",
                    backgroundSize: "17px 17px",
                  }}
                />

                {/* Top caption */}
                <div className="absolute left-7 top-7 z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#80667c] sm:left-9 sm:top-9">
                  <span className="h-px w-6 bg-[#b99bb4]" />
                  An invitation to read
                </div>

                {/* Book */}
                <div className="absolute inset-0 flex items-center justify-center p-7 sm:p-10">
                  <div className="group relative aspect-[0.76] w-[72%] rotate-[-5deg] rounded-[4px] bg-[#d9c7d6] shadow-[16px_22px_35px_rgba(74,39,69,0.15)] transition-transform duration-700 hover:rotate-0">
                    <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[4px] border border-[#c8b1c6] bg-[#bca1ba]" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[4px] border border-white/20 bg-[#4a2745] px-5 text-center text-[#faf8f4] shadow-xl sm:px-8">
                      <span className="mb-7 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#d8b9d2] sm:text-[10px]">
                        The art of
                      </span>

                      <h2 className="font-['Playfair_Display',serif] text-3xl italic leading-tight sm:text-4xl lg:text-5xl">
                        Getting
                        <br />
                        Lost
                        <br />
                        in Stories
                      </h2>

                      <span className="mb-6 mt-7 h-px w-12 bg-[#d8b9d2]" />

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="h-8 w-8 text-[#d8b9d2]"
                        aria-hidden="true"
                      >
                        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8m0-12.8L5.6 18.4" />
                      </svg>

                      <span className="mt-7 text-[9px] font-medium uppercase tracking-[0.24em] text-white/60">
                        Bookstore edition
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating quote card */}
                <div className="absolute bottom-7 left-7 z-10 max-w-[180px] rounded-xl border border-white/80 bg-[#faf8f4]/95 p-4 shadow-lg backdrop-blur-md transition-transform duration-500 hover:-translate-y-1 sm:bottom-9 sm:left-9">
                  <p className="font-['Playfair_Display',serif] text-lg italic text-[#4a2745]">
                    "Read slowly. Feel deeply."
                  </p>

                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b7487]">
                    Our little reminder
                  </p>
                </div>

                {/* Floating decorative seal */}
                <div className="absolute bottom-8 right-7 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white/80 text-[#6b2d63] shadow-md backdrop-blur-md transition-transform duration-500 hover:scale-110 sm:bottom-10 sm:right-9">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M20.8 8.8c0 4.1-8.8 10.2-8.8 10.2S3.2 12.9 3.2 8.8A4.7 4.7 0 0 1 12 6.5a4.7 4.7 0 0 1 8.8 2.3Z" />
                  </svg>
                </div>
              </div>

              {/* Outer rings */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-4 -z-10 h-28 w-28 rounded-full border border-[#d9c5d7] sm:-right-7 sm:-top-7 sm:h-36 sm:w-36"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-4 -left-4 -z-10 h-24 w-24 rounded-full border border-[#e6d3c6] sm:-bottom-7 sm:-left-7 sm:h-32 sm:w-32"
              />
            </div>
          </div>
        </section>

        {/* ================= OUR STORY ================= */}
        
<section
  id="our-story"
  className="relative scroll-mt-24 overflow-hidden px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32"
>
  {/* Decorative background accents */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#f1e6ef]/60 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[#f4e9df]/50 blur-3xl"
  />

  <div className="relative mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
    {/* Section heading */}
    <div
      data-reveal
      className="about-reveal lg:sticky lg:top-28"
    >
      <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#8b7487]">
        <span className="h-px w-8 bg-[#b58aa7]" />
        A little about us
      </p>

      <h2 className="max-w-lg font-['Playfair_Display',serif] text-4xl font-medium leading-[1.16] tracking-tight text-[#4a2745] sm:text-5xl lg:text-6xl">
        Every great story begins with a{" "}
        <span className="italic text-[#8b5480]">
          love of reading.
        </span>
      </h2>

      <p className="mt-6 max-w-sm text-base leading-8 text-[#756675] sm:text-lg">
        A little corner of the internet for curious minds, thoughtful
        readers, and stories that stay with us long after the final page.
      </p>

      {/* Decorative divider */}
      <div className="mt-9 flex items-center gap-2">
        <span className="h-1 w-12 rounded-full bg-[#8b5480]" />
        <span className="h-1 w-5 rounded-full bg-[#d4b4c8]" />
        <span className="h-1 w-2 rounded-full bg-[#eadde7]" />
      </div>

      {/* Reading-inspired detail */}
      <div className="mt-12 hidden items-center gap-4 rounded-xl border border-[#eae0e8] bg-white/70 p-5 sm:flex">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f4eaf2] text-[#7c4975]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M12 7v14" />
            <path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13" />
            <path d="M3 18a2 2 0 0 0 2 2h3a4 4 0 0 1 4 4" />
          </svg>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#4a2745]">
            Made for book lovers
          </p>
          <p className="mt-1 text-sm leading-6 text-[#857785]">
            Discover a story that feels like yours.
          </p>
        </div>
      </div>
    </div>

    {/* Story content */}
    <div
      data-reveal
      className="about-reveal"
      style={{ transitionDelay: "120ms" }}
    >
      <div className="space-y-6 text-base leading-8 text-[#6b5f6b] sm:text-lg sm:leading-9">
        <p>
          Somewhere between a beautifully written sentence and the
          feeling of finishing a book you never wanted to end, we
          discovered something special: reading gives us a chance to
          see the world through someone else's eyes.
        </p>

        <p>
          Bookstore was created around that feeling. We imagined a
          welcoming space where finding your next read feels personal
          rather than overwhelming, where every title has room to
          make an impression, and where you can explore at your own pace.
        </p>

        <p>
          For us, books are more than pages bound together. They are
          new perspectives, unexpected connections, quiet escapes,
          and little reminders that there is always something more to
          discover.
        </p>
      </div>

      {/* Pull quote card */}
      <div className="group relative mt-10 overflow-hidden rounded-2xl border border-[#e8dce6] bg-white/90 p-6 shadow-[0_12px_40px_rgba(74,39,69,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(74,39,69,0.09)] sm:p-9">
        {/* Decorative corner accent */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-[#f7eff6] transition-transform duration-500 group-hover:scale-110"
        />

        <span
          aria-hidden="true"
          className="absolute right-5 top-0 font-['Playfair_Display',serif] text-[140px] leading-none text-[#eadce8]/70 sm:right-8 sm:text-[170px]"
        >
          ”
        </span>

        <div className="relative">
          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5edf5] text-[#8b5480]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M10 11H5V6h5v5Zm9 0h-5V6h5v5ZM5 11c0 4 1.5 6 4 7m5-7c0 4 1.5 6 4 7" />
            </svg>
          </div>

          <p className="max-w-xl font-['Playfair_Display',serif] text-2xl italic leading-relaxed text-[#4a2745] sm:text-3xl">
            We don't just turn pages. We open possibilities.
          </p>

          <div className="mt-7 flex items-center gap-3">
            <span className="h-px w-8 bg-[#b58aa7]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b7487]">
              The Bookstore philosophy
            </span>
          </div>
        </div>
      </div>

      {/* Closing note */}
      <p className="mt-7 flex items-center gap-2 text-sm leading-6 text-[#857785]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-[#9a7192]"
          aria-hidden="true"
        >
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>

        Created with a love for stories and the people who read them.
      </p>
    </div>
  </div>
</section>

      </main>

      {/* Shared Footer stays outside the page-specific font wrapper */}
      <Footer />

      <style>{`
        .about-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 700ms ease,
            transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .about-reveal.about-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .about-reveal,
          .about-reveal.about-visible {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
