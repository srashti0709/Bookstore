
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        alert("Invalid login response.");
        return;
      }

      if (user.role === "admin") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user));

        navigate("/admin", { replace: true });
      } else {
        // Clear any previous admin session.
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        // Store the normal user's session separately.
        localStorage.setItem("userToken", token);
        localStorage.setItem("userData", JSON.stringify(user));

        navigate("/", { replace: true });
      }
    } catch (error) {
      if (error.response?.data?.code === "USER_NOT_FOUND") {
        navigate("/register", {
          replace: true,
          state: { email },
        });
      } else {
        alert(
          error.response?.data?.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#faf8f4] px-5 py-12 font-['Plus_Jakarta_Sans',sans-serif] text-[#4a2745] sm:px-8 lg:py-16">
      {/* Background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#f1e6f0]/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-28 h-96 w-96 rounded-full bg-[#f4e8df]/70 blur-3xl"
      />

      {/* Brand */}
      <div className="relative z-10 mx-20 mb-10 max-w-6xl">
        <Link
          to="/"
          className="group inline-flex items-center gap-3"
          aria-label="Return to bookstore homepage"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4a2745] text-[#faf8f4] shadow-lg shadow-[#4a2745]/10 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="M12 7.5C9.8 5.8 6.8 5.2 3.5 5.8v12c3.3-.6 6.3 0 8.5 1.7m0-12C14.2 5.8 17.2 5.2 20.5 5.8v12c-3.3-.6-6.3 0-8.5 1.7m0-12v12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span>
            <span className="block font-['Playfair_Display',serif] text-2xl font-bold tracking-tight">
              Bookstore
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8b7487]">
              A world between pages
            </span>
          </span>
        </Link>
      </div>

      {/* Login layout */}
      <div className="relative z-10 mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#ebe6e6] bg-white shadow-[0_24px_80px_rgba(74,39,69,0.09)] lg:grid-cols-[1fr_0.95fr]">
        {/* Editorial panel */}
        <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-[#4a2745] p-10 text-[#faf8f4] sm:p-12 lg:flex xl:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-6 h-52 w-52 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#6b2d63]/50 blur-3xl"
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f2d9ec]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e7bfdc]" />
              Your next chapter awaits
            </span>
          </div>

          <div className="relative my-12">
            <div className="mb-8 flex items-center gap-3 text-[#e4bfdc]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                className="h-8 w-8"
                aria-hidden="true"
              >
                <path
                  d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72m0-12.72L5.64 18.36"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-[0.24em]">
                A quiet place for curious minds
              </span>
            </div>

            <h1 className="max-w-md font-['Playfair_Display',serif] text-5xl font-medium leading-[1.12] tracking-tight xl:text-6xl">
              Every great story begins{" "}
              <span className="italic text-[#e7bfdc]">with you.</span>
            </h1>

            <p className="mt-6 max-w-sm text-base leading-8 text-white/70">
              Return to your personal reading world. Discover meaningful
              stories, revisit your favourites, and find the words you didn't
              know you needed.
            </p>
          </div>

          <div className="relative border-t border-white/15 pt-6">
            <p className="font-['Playfair_Display',serif] text-xl italic leading-relaxed text-white/85">
              "A reader lives a thousand lives before he dies."
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-[#d6b5d0]">
              — George R. R. Martin
            </p>
          </div>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-12 xl:px-14">
          <div className="w-full max-w-md">
            <div className="mb-9">
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8b7487]">
                <span className="h-px w-7 bg-[#c9a8c5]" />
                Welcome back
              </p>

              <h2 className="font-['Playfair_Display',serif] text-4xl font-semibold tracking-tight text-[#4a2745] sm:text-5xl">
                Sign in to your
                <span className="mt-1 block italic text-[#8b5480]">
                  reading world.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#7a6877] sm:text-base">
                Pick up where you left off. Your next favourite book is waiting.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-sm font-semibold text-[#4a2745]"
                >
                  Email address
                </label>

                <div className="group relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#9a8296] transition-colors group-focus-within:text-[#6b2d63]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />
                      <path
                        d="m4 7 8 6 8-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-[#e8dfe7] bg-[#fdfbf9] py-3.5 pl-12 pr-4 text-sm text-[#4a2745] outline-none transition-all placeholder:text-[#b3a4b1] hover:border-[#d4c1d1] focus:border-[#8b5480] focus:bg-white focus:ring-4 focus:ring-[#8b5480]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#4a2745]"
                  >
                    Password
                  </label>
                </div>

                <div className="group relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#9a8296] transition-colors group-focus-within:text-[#6b2d63]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <rect
                        x="4"
                        y="10"
                        width="16"
                        height="11"
                        rx="2"
                      />
                      <path
                        d="M8 10V7a4 4 0 0 1 8 0v3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-[#e8dfe7] bg-[#fdfbf9] py-3.5 pl-12 pr-12 text-sm text-[#4a2745] outline-none transition-all placeholder:text-[#b3a4b1] hover:border-[#d4c1d1] focus:border-[#8b5480] focus:bg-white focus:ring-4 focus:ring-[#8b5480]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-3 flex items-center rounded-md px-2 text-[#8b7487] transition-colors hover:text-[#4a2745] focus:outline-none focus:ring-2 focus:ring-[#8b5480]/30"
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a15.5 15.5 0 0 1-3.1 3.9M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7c1.2 0 2.3-.3 3.3-.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg bg-[#562c50] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#562c50]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6b2d63] hover:shadow-xl hover:shadow-[#562c50]/20 focus:outline-none focus:ring-4 focus:ring-[#8b5480]/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative">
                  {loading ? "Signing you in..." : "Sign in to your account"}
                </span>

                {!loading && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                {loading && (
                  <span
                    className="relative h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#eee7ed]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad9baa]">
                Your story continues
              </span>
              <span className="h-px flex-1 bg-[#eee7ed]" />
            </div>

            <p className="text-center text-sm leading-7 text-[#7a6877]">
              New to our reading community?{" "}
              <Link
                to="/register"
                className="font-bold text-[#6b2d63] underline decoration-[#d8bfd5] decoration-1 underline-offset-4 transition-colors hover:text-[#4a2745] hover:decoration-[#4a2745]"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-8 text-center text-xs leading-6 text-[#a08f9e]">
              Thoughtfully curated for readers, one page at a time.
            </p>
          </div>
        </section>
      </div>

      <footer className="relative z-10 mt-8 text-center text-xs text-[#9b8998]">
        © {new Date().getFullYear()} Bookstore. Made for the love of reading.
      </footer>
    </main>
  );
};

export default Login;
