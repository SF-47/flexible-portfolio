import {
  Inter,
  Poppins,
  Playfair_Display,
  Merriweather,
  Oswald,
  Space_Mono,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-portfolio-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-portfolio-poppins",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-portfolio-playfair",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-portfolio-merriweather",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-portfolio-oswald",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-portfolio-space-mono",
  display: "swap",
});

// The fonts an admin can pick. Each one looks clearly different from the others:
// clean sans, geometric sans, elegant serif, sturdy serif, condensed, monospace.
// The backend (ThemeService.SupportedFonts) must list the same names.
const loaded = [
  { name: "Inter", font: inter, variable: "--font-portfolio-inter" },
  { name: "Poppins", font: poppins, variable: "--font-portfolio-poppins" },
  {
    name: "Playfair Display",
    font: playfair,
    variable: "--font-portfolio-playfair",
  },
  {
    name: "Merriweather",
    font: merriweather,
    variable: "--font-portfolio-merriweather",
  },
  { name: "Oswald", font: oswald, variable: "--font-portfolio-oswald" },
  {
    name: "Space Mono",
    font: spaceMono,
    variable: "--font-portfolio-space-mono",
  },
];

export const fontNames = loaded.map((item) => item.name);

// Font name -> CSS font-family value.
export const fontFamilies: Record<string, string> = Object.fromEntries(
  loaded.map((item) => [item.name, `var(${item.variable})`]),
);

// Class names that define the CSS variables above; put them on a wrapping element.
export const fontVariableClasses = loaded
  .map((item) => item.font.variable)
  .join(" ");
