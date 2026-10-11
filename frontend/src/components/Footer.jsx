
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const editorialLinks = [
    { name: "Explore Books", path: "/explore" },
    { name: "Books by Category", path: "/categories" },
    { name: "About the Bookstore", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <footer className="border-t border-[#ece5df] bg-[#faf9f6] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        {/* Brand */}
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 font-['Playfair_Display',serif] text-2xl text-[#4a2745] transition-colors hover:text-[#6b2d63]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
            </svg>
            Bookstore
          </Link>

          <p className="mt-5 max-w-sm font-['Playfair_Display',serif] text-3xl italic leading-relaxed text-[#6b5f6b]">
            “A good book leaves you with a world you didn't know before.”
          </p>

          <p className="mt-4 max-w-xs text-base leading-6 text-[#7b6f7b]">
            An independent digital library for curious minds,
            thoughtful reading, and stories worth keeping.
          </p>
        </div>

        {/* Explore */}
        <div>
          <p className="text-base font-semibold uppercase tracking-widest text-[#7b6f7b]">
            Explore
          </p>

          <ul className="mt-4 space-y-3 text-base text-[#4a4050]">
            {editorialLinks.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="transition-colors duration-200 hover:text-[#5a2458]"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Reader's Corner */}
        <div>
          <p className="text-base font-semibold uppercase tracking-widest text-[#7b6f7b]">
            Reader's Corner
          </p>

          <p className="mt-4 max-w-xs text-base leading-7 text-[#6b5f6b]">
            Discover your next favorite read, revisit treasured stories,
            and build your personal reading collection.
          </p>

          <Link
            to="/library"
            className="mt-5 inline-flex items-center gap-2 text-base font-medium text-[#5a2458] transition-colors duration-200 hover:text-[#6b2d63]"
          >
            Visit My Library
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-[#ece5df] px-6 py-5 text-base text-[#7b6f7b] sm:flex-row lg:px-8">
        <span>
          © {new Date().getFullYear()} Bookstore. All rights reserved.
        </span>

        <span>Designed &amp; curated by Srashti Shakya</span>
      </div>
    </footer>
  );
};

export default Footer;
