import { siteConfig } from "@/data/siteConfig";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 md:px-20">
      <h1 className="text-2xl font-bold tracking-widest">
        {siteConfig.company.name}
      </h1>

      <div className="hidden items-center gap-8 md:flex">
        <a href="#about" className="hover:text-amber-400">
          About
        </a>
        <a href="#services" className="hover:text-amber-400">
          Services
        </a>
        <a href="#projects" className="hover:text-amber-400">
          Projects
        </a>
      </div>
    </nav>
  );
}
