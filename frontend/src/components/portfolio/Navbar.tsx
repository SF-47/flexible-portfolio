import { siteConfig } from "@/data/siteConfig";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 md:px-20">
      <h1 className="text-2xl font-bold tracking-widest">
        {siteConfig.company.name}
      </h1>

      <div className="hidden items-center gap-8 md:flex">
        <a href="#home" className="hover:text-brand-accent">
          Home
        </a>
        <a href="#about" className="hover:text-brand-accent">
          About
        </a>
        <a href="#services" className="hover:text-brand-accent">
          Services
        </a>
        <a href="#projects" className="hover:text-brand-accent">
          Projects
        </a>
        <a href="#contact" className="hover:text-brand-accent">
          Contact
        </a>
      </div>
    </nav>
  );
}
