"use client";

import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return;
    }

    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <section
      id="contact"
      className="bg-slate-100 px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            Get In Touch
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">
            Let&apos;s Build Something Great
          </h2>

          <p className="leading-8 text-slate-600">
            Have a project in mind? Contact our team and let&apos;s discuss how
            we can bring your vision to life.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="flex items-start gap-5">
              <MapPin className="mt-1 text-brand-accent-text" size={26} />
              <div>
                <h3 className="mb-2 text-xl font-bold">Our Office</h3>
                <p className="text-slate-600">Beirut, Lebanon</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <Phone className="mt-1 text-brand-accent-text" size={26} />
              <div>
                <h3 className="mb-2 text-xl font-bold">Call Us</h3>
                <a
                  href="tel:+96170123456"
                  className="text-slate-600 hover:text-brand-accent-text"
                >
                  +961 70 123 456
                </a>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <Mail className="mt-1 text-brand-accent-text" size={26} />
              <div>
                <h3 className="mb-2 text-xl font-bold">Email Us</h3>
                <a
                  href="mailto:info@atlasconstruction.example"
                  className="text-slate-600 hover:text-brand-accent-text"
                >
                  info@atlasconstruction.example
                </a>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl bg-brand-background p-8 shadow-sm"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setSubmitted(false);
                }}
                placeholder="Your name"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={254}
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setSubmitted(false);
                }}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-semibold"
              >
                Your Message
              </label>
              <textarea
                id="message"
                rows={5}
                required
                maxLength={3000}
                value={form.message}
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  setSubmitted(false);
                }}
                placeholder="Tell us about your project..."
                className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-brand-accent"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-3 rounded-lg bg-brand-accent px-8 py-4 font-semibold text-brand-on-accent transition hover:opacity-85"
            >
              Send Message
              <Send size={18} />
            </button>

            {submitted && (
              <p role="status" className="text-sm text-brand-accent-text">
                Demo only: your message was not sent or saved.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
