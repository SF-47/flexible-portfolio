import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SiteTheme from "@/components/SiteTheme";

export default function Home() {
  return (
    <SiteTheme>
      <main className="min-h-screen bg-brand-primary text-white">
        <Navbar />
        <Hero />
        <About />
        <Stats />
        <Services />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </SiteTheme>
  );
}
