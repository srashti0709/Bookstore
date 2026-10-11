
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bookLogo from "../assets/book-logo.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [notice, setNotice] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userToken = localStorage.getItem("userToken");
  const adminToken = localStorage.getItem("adminToken");

  const isLoggedIn = Boolean(userToken || adminToken);

  let currentUser = null;

  try {
    currentUser = userToken
      ? JSON.parse(localStorage.getItem("userData") || "null")
      : JSON.parse(localStorage.getItem("adminUser") || "null");
  } catch {
    currentUser = null;
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const requireLogin = (action) => {
    if (!isLoggedIn) {
      setNotice(`Please login first to access ${action}.`);
      setMobileMenuOpen(false);
      return;
    }

    setNotice("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    setNotice("");
    setMobileMenuOpen(false);

    navigate("/", { replace: true });
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setNotice("");
  };

  const linkClass = (path) => {
    const isActive = location.pathname === path;

    return `relative inline-flex items-center py-2 text-base font-medium
      transition-colors duration-200
      ${
        isActive
          ? "text-[#5B3150] md:after:absolute md:after:-bottom-[9px] md:after:left-0 md:after:right-0 md:after:h-px md:after:bg-[#5B3150]"
          : "text-[#514c49] hover:text-[#5B3150]"
      }`;
  };

  const buttonClass =
    "inline-flex min-h-11 items-center justify-center rounded-md border border-[#d9d2ca] px-4 py-2 text-base font-medium text-[#514c49] transition-colors duration-200 hover:border-[#5B3150] hover:text-[#5B3150]";

  return (
    <nav className="relative z-50 w-full border-b border-[#eeeae3] bg-[#faf9f6]">
      {/* Main Navbar */}
      <div className="mx-auto flex min-h-[76px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          aria-label="Bookstore home"
          className="flex shrink-0 items-center"
        >
          <div className="flex items-center gap-3">
            <img
              src={bookLogo}
              alt="Bookstore logo"
              className="h-8 w-auto max-w-12 object-contain sm:h-9"
            />

            <span className="font-serif text-xl font-medium tracking-[-0.02em] text-[#342d2b] sm:text-2xl">
              Bookstore
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={linkClass(item.path)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => requireLogin("search")}
            className="flex h-11 w-11 items-center justify-center rounded-md text-[#514c49] transition-colors hover:bg-[#f1eee8] hover:text-[#5B3150]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
          </button>

          {/* Account */}
          {isLoggedIn ? (
            <div className="flex max-w-[240px] items-center gap-3">
              <span
                title={currentUser?.name || "My Account"}
                className="max-w-[150px] truncate text-base font-medium text-[#514c49]"
              >
                {currentUser?.name || "My Account"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className={buttonClass}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className={buttonClass}>
              Sign In
            </Link>
          )}

          {/* My Library */}
          {isLoggedIn ? (
            <Link
              to="/library"
              className="inline-flex min-h-11 items-center text-base font-medium text-[#514c49] transition-colors hover:text-[#5B3150]"
            >
              My Library
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => requireLogin("your library")}
              className="inline-flex min-h-11 items-center text-base font-medium text-[#514c49] transition-colors hover:text-[#5B3150]"
            >
              My Library
            </button>
          )}
        </div>

        {/* Mobile / Tablet Actions */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          
          {/* Menu Toggle */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-[#e5ded5] text-[#514c49] transition-colors hover:bg-[#f1eee8] hover:text-[#5B3150]"
          >
            {mobileMenuOpen ? (
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#eeeae3] bg-[#faf9f6] px-4 py-5 sm:px-6 lg:hidden"
        >
          <div className="mx-auto flex max-w-[1400px] flex-col gap-1">
            {/* Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex min-h-12 items-center rounded-md px-3 text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-[#f1eee8] text-[#5B3150]"
                    : "text-[#514c49] hover:bg-[#f4f2ed] hover:text-[#5B3150]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Search */}
            <button
              type="button"
              onClick={() => requireLogin("search")}
              className="flex min-h-12 items-center gap-3 rounded-md px-3 text-left text-base font-medium text-[#514c49] transition-colors hover:bg-[#f4f2ed] hover:text-[#5B3150]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
              Search
            </button>

            {/* Account Information */}
            {isLoggedIn && (
              <div className="mt-3 rounded-md border border-[#e5ded5] bg-[#f4f2ed] p-4">
                <p className="text-base font-medium text-[#342d2b]">
                  {currentUser?.name || "My Account"}
                </p>

                {currentUser?.email && (
                  <p className="mt-1 break-all text-base text-[#6b4a68]">
                    {currentUser.email}
                  </p>
                )}
              </div>
            )}

            {/* My Library */}
            {isLoggedIn ? (
              <Link
                to="/library"
                onClick={closeMobileMenu}
                className="mt-2 flex min-h-12 items-center rounded-md px-3 text-base font-medium text-[#514c49] transition-colors hover:bg-[#f4f2ed] hover:text-[#5B3150]"
              >
                My Library
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => requireLogin("your library")}
                className="mt-2 flex min-h-12 items-center rounded-md px-3 text-left text-base font-medium text-[#514c49] transition-colors hover:bg-[#f4f2ed] hover:text-[#5B3150]"
              >
                My Library
              </button>
            )}

            {/* Sign In / Logout */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex min-h-12 w-full items-center justify-center rounded-md border border-[#d9d2ca] px-4 py-2 text-base font-medium text-[#514c49] transition-colors hover:border-[#5B3150] hover:text-[#5B3150]"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="mt-3 flex min-h-12 items-center justify-center rounded-md border border-[#d9d2ca] px-4 py-2 text-base font-medium text-[#514c49] transition-colors hover:border-[#5B3150] hover:text-[#5B3150]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Login Notice */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-wrap items-center justify-center gap-3 border-t border-[#eeeae3] bg-[#f4f2ed] px-4 py-3 text-center text-base text-[#5B3150] sm:px-6"
        >
          <span>{notice}</span>

          <button
            type="button"
            onClick={() => setNotice("")}
            className="min-h-11 rounded-md px-3 font-medium underline underline-offset-4 hover:text-[#342d2b]"
          >
            Dismiss
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
