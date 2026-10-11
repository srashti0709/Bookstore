
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const Contact = () => {
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_TEMPLATE_ID ||
      !EMAILJS_PUBLIC_KEY
    ) {
      setStatus("error");
      setStatusMessage(
        "Email service is not configured. Please check your environment variables."
      );
      return;
    }

    setStatus("sending");
    setStatusMessage("");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.from_name.trim(),
          from_email: formData.from_email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      setStatus("success");
      setStatusMessage(
        "Your message has been sent successfully! Thank you for reaching out. We'll be happy to hear from you again."
      );

      setFormData({
        from_name: "",
        from_email: "",
        subject: "",
        message: "",
      });

    } catch (error) {
      console.error("EmailJS submission failed:", error);
      console.error("EmailJS status:", error?.status);
      console.error("EmailJS message:", error?.text);

      setStatus("error");
      setStatusMessage(
        `EmailJS error (${error?.status ?? "unknown"}): ${error?.text ?? error?.message ?? "Unknown error"
        }`
      );
    }

  };

  const inputClass =
    "w-full rounded-lg border border-[#e8dfe6] bg-white px-4 py-3.5 text-sm text-[#4a2745] outline-none transition-all duration-200 placeholder:text-[#ad9eac] hover:border-[#cdb8cb] focus:border-[#8b5480] focus:ring-4 focus:ring-[#8b5480]/10";

  return (
    <div className="min-h-screen overflow-hidden bg-[#faf8f4] text-[#4a2745]">
      <Navbar />

      <main className="font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Hero */}
        <section className="relative px-6 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-12 lg:pt-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#eee0ed]/60 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#f1e6dc]/60 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8dce6] bg-white/80 px-4 py-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-[#8b5480]"
                  aria-hidden="true"
                >
                  <path d="M4 4h16v16H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>

                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#765e73]">
                  We'd love to hear from you
                </span>
              </div>

              <h1 className="font-['Playfair_Display',serif] text-4xl font-medium leading-tight tracking-tight sm:text-5xl lg:text-7xl">
                Every good conversation
                <br className="hidden sm:block" />{" "}
                <span className="italic text-[#8b5480]">
                  starts somewhere.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#756675] sm:text-lg">
                Have a question, a suggestion, or a book recommendation
                to share? Drop us a message. We're always happy to
                connect with fellow book lovers.
              </p>

              <div className="mt-8 flex items-center justify-center gap-2">
                <span className="h-1 w-12 rounded-full bg-[#8b5480]" />
                <span className="h-1 w-5 rounded-full bg-[#d4b4c8]" />
                <span className="h-1 w-2 rounded-full bg-[#eadde7]" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact form and information */}
        <section className="px-6 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
          <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            {/* Left information panel */}
            <aside className="relative overflow-hidden rounded-2xl bg-[#4a2745] p-7 text-white sm:p-10 lg:min-h-[590px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10"
              />

              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2c6df]">
                  The reader's corner
                </p>

                <h2 className="mt-5 font-['Playfair_Display',serif] text-3xl leading-snug sm:text-4xl">
                  Let's make room for a conversation.
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                  Whether you need help finding a book or simply want
                  to share your thoughts, we're here to listen.
                </p>

                <div className="my-9 h-px bg-white/15" />

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-[#e8cde5]"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Send us a message
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/65">
                        Fill out the form and tell us what's on your mind.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-[#e8cde5]"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        We're listening
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/65">
                        We'll do our best to get back to you as soon
                        as we can.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.06] p-5">
                  <p className="font-['Playfair_Display',serif] text-xl italic leading-relaxed text-[#f0dced]">
                    "A few thoughtful words can open a whole new chapter."
                  </p>

                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    A little bookstore thought
                  </p>
                </div>
              </div>
            </aside>

            {/* Contact form */}
            <div className="rounded-2xl border border-[#ebe3e9] bg-white p-6 shadow-[0_16px_60px_rgba(74,39,69,0.045)] sm:p-9 lg:p-10">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b7487]">
                  Contact form
                </p>

                <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl font-medium text-[#4a2745] sm:text-4xl">
                  Write to us
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#857785]">
                  Fields marked with an asterisk (*) are required.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="from_name"
                      className="mb-2 block text-sm font-semibold text-[#4a2745]"
                    >
                      Your name <span className="text-[#9a5689">*</span>
                    </label>

                    <input
                      id="from_name"
                      name="from_name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Alex Morgan"
                      value={formData.from_name}
                      onChange={handleChange}
                      className={inputClass}
                      maxLength={100}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="from_email"
                      className="mb-2 block text-sm font-semibold text-[#4a2745]"
                    >
                      Email address{" "}
                      <span className="text-[#9a5689]">*</span>
                    </label>

                    <input
                      id="from_email"
                      name="from_email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.from_email}
                      onChange={handleChange}
                      className={inputClass}
                      maxLength={254}
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-[#4a2745]"
                  >
                    Subject <span className="text-[#9a5689]">*</span>
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What would you like to talk about?"
                    value={formData.subject}
                    onChange={handleChange}
                    className={inputClass}
                    maxLength={150}
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-[#4a2745]"
                    >
                      Your message{" "}
                      <span className="text-[#9a5689]">*</span>
                    </label>

                    <span className="text-xs text-[#a394a2]">
                      {formData.message.length}/2000
                    </span>
                  </div>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-y`}
                    maxLength={2000}
                    required
                  />
                </div>

                {/* Status feedback */}
                {statusMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`flex items-start gap-3 rounded-lg border p-4 text-sm leading-6 ${status === "success"
                        ? "border-[#cfe6d7] bg-[#f0f8f1] text-[#28633d]"
                        : "border-[#efd5d5] bg-[#fff5f4] text-[#9b3838]"
                      }`}
                  >
                    {status === "success" ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 h-5 w-5 shrink-0"
                        aria-hidden="true"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 h-5 w-5 shrink-0"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v4m0 4h.01" />
                      </svg>
                    )}

                    <p>{statusMessage}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#562c50] px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#6b2d63] hover:shadow-[0_10px_25px_rgba(86,44,80,0.2)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[210px]"
                >
                  {status === "sending" ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
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
                          opacity="0.25"
                        />
                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>

                      Sending message...
                    </>
                  ) : (
                    <>
                      Send your message

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-xs leading-6 text-[#978897]">
                  Your details will be used to respond to your inquiry.
                  Please don't include passwords or other sensitive
                  information in your message.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Back to browsing */}
        <section className="border-t border-[#ebe3e9] bg-[#f4f2ed] px-6 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-['Playfair_Display',serif] text-2xl text-[#4a2745] sm:text-3xl">
                Still looking for your next read?
              </p>

              <p className="mt-2 text-sm leading-6 text-[#756675]">
                There are more stories waiting to be discovered.
              </p>
            </div>

            <Link
              to="/library"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d9c9d6] bg-white px-5 py-3 text-sm font-semibold text-[#562c50] transition-all duration-200 hover:border-[#8b5480] hover:bg-[#f9f2f8]"
            >
              Explore your library

              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
