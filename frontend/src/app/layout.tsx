import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-pt-22 antialiased`}
    >
      <body
        className={[
          "flex min-h-full flex-col",
          // Show a pointer on anything clickable, and "not-allowed" on disabled controls.
          "[&_:is(a[href],button:not(:disabled),summary,select:not(:disabled),label[for],[role=button],[role=tab],[role=switch],[role=menuitem],input[type=checkbox],input[type=radio],input[type=submit],input[type=file])]:cursor-pointer",
          "[&_:is(button:disabled,[aria-disabled=true])]:cursor-not-allowed",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
