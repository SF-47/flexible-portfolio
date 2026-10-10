import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteTheme from "@/components/SiteTheme";
import SectionRenderer from "@/components/sections/SectionRenderer";
import { sections } from "@/data/sections";

export default function Home() {
  return (
    <SiteTheme>
      <main className="min-h-screen bg-brand-primary text-brand-on-primary">
        <Navbar />
        <SectionRenderer sections={sections} />
        <Footer />
      </main>
    </SiteTheme>
  );
}
