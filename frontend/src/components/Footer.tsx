import { ArrowUpRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-brand-primary px-8 pt-20 text-brand-on-primary md:px-20">
      <div className="mx-auto grid max-w-7xl gap-12 pb-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-3xl font-bold tracking-widest">ATLAS.</h2>

          <p className="max-w-md leading-8 text-brand-on-primary/70">
            Building the future through innovation, craftsmanship, and
            excellence in construction and engineering.
          </p>

          <div className="mt-8 flex gap-5 text-brand-on-primary/80">
            <a href="https://facebook.com" aria-label="Facebook">
              <FaFacebook size={22} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <FaInstagram size={22} />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <FaLinkedin size={22} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>

          <ul className="space-y-4 text-brand-on-primary/70">
            <li>
              <a href="#home" className="hover:text-brand-accent">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-brand-accent">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-brand-accent">
                Services
              </a>
            </li>
            <li>
              <a href="#projects" className="hover:text-brand-accent">
                Projects
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-brand-accent">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-lg font-semibold">Contact</h3>

          <div className="space-y-4 text-brand-on-primary/70">
            <p>Beirut, Lebanon</p>
            <p>+961 70 123 456</p>
            <p>info@atlasconstruction.example</p>
          </div>

          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-accent"
          >
            Start a Project
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-brand-on-primary/15 py-7 text-sm text-brand-on-primary/70 md:flex-row">
        <p>
          © {new Date().getFullYear()} ATLAS Construction. All rights reserved.
        </p>

        <p>Built with precision and purpose.</p>
      </div>
    </footer>
  );
}
