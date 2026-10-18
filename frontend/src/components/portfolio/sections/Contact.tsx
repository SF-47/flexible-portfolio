"use client";

import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import type { ContactContent } from "@/types/sectionContent";
import { sendContactMessage } from "@/lib/ContactMessages";
import Reveal from "@/components/portfolio/Reveal";

type ContactInfo = {
  email: string | null;
  phone: string | null;
  address: string | null;
};

type ContactProps = {
  content: ContactContent;
  contactInfo: ContactInfo;
};

export default function Contact({ content, contactInfo }: ContactProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitted(false);
    setError("");

    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="bg-brand-surface px-8 py-16 md:py-24 text-brand-text md:px-20"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            {content.label}
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">
            {content.title}
          </h2>

          <p className="leading-8 text-brand-muted">{content.description}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {contactInfo.address && (
              <div className="flex items-start gap-5">
                <MapPin className="mt-1 text-brand-accent-text" size={26} />
                <div>
                  <h3 className="mb-2 text-xl font-bold">
                    {content.addressTitle}
                  </h3>
                  <p className="text-brand-muted">{contactInfo.address}</p>
                </div>
              </div>
            )}

            {contactInfo.phone && (
              <div className="flex items-start gap-5">
                <Phone className="mt-1 text-brand-accent-text" size={26} />
                <div>
                  <h3 className="mb-2 text-xl font-bold">
                    {content.phoneTitle}
                  </h3>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                    className="text-brand-muted hover:text-brand-accent-text"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            )}

            {contactInfo.email && (
              <div className="flex items-start gap-5">
                <Mail className="mt-1 text-brand-accent-text" size={26} />
                <div>
                  <h3 className="mb-2 text-xl font-bold">
                    {content.emailTitle}
                  </h3>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-brand-muted hover:text-brand-accent-text"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            )}
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
                {content.nameLabel}
              </label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                disabled={isSubmitting}
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setSubmitted(false);
                  setError("");
                }}
                placeholder={content.namePlaceholder}
                className="w-full rounded-lg border border-brand-border px-4 py-3 outline-none focus:border-brand-accent disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                {content.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={254}
                disabled={isSubmitting}
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setSubmitted(false);
                  setError("");
                }}
                placeholder={content.emailPlaceholder}
                className="w-full rounded-lg border border-brand-border px-4 py-3 outline-none focus:border-brand-accent disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-semibold"
              >
                {content.messageLabel}
              </label>
              <textarea
                id="message"
                rows={5}
                required
                maxLength={3000}
                disabled={isSubmitting}
                value={form.message}
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  setSubmitted(false);
                  setError("");
                }}
                placeholder={content.messagePlaceholder}
                className="w-full resize-none rounded-lg border border-brand-border px-4 py-3 outline-none focus:border-brand-accent disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-3 rounded-lg bg-brand-accent px-8 py-4 font-semibold text-brand-on-accent transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : content.buttonText}
              <Send size={18} />
            </button>

            {submitted && (
              <p role="status" className="text-sm text-green-600">
                Your message has been sent successfully!
              </p>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
          </form>
        </div>
      </Reveal>
    </section>
  );
}
