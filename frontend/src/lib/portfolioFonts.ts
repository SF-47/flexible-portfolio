import { Inter, Poppins, Roboto, Lato } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-portfolio-inter",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-portfolio-poppins",
  display: "swap",
});

export const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-portfolio-roboto",
  display: "swap",
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-portfolio-lato",
  display: "swap",
});
