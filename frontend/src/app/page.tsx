import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteTheme from "@/components/SiteTheme";
import SectionRenderer from "@/components/sections/SectionRenderer";

export default function Home() {
  return (
    <SiteTheme>
      <main className="min-h-screen bg-brand-primary text-brand-on-primary">
        <Navbar />
        <SectionRenderer />
        <Footer />
      </main>
    </SiteTheme>
  );
}
