"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function update() {
      const hero = document.getElementById("home");
      const threshold = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;

      setVisible(window.scrollY > threshold);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full bg-brand-accent text-brand-on-accent shadow-lg transition duration-300 hover:opacity-85 md:right-8 md:bottom-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp size={22} aria-hidden="true" />
    </button>
  );
}
