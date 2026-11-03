"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";

// Shows the background image behind the Hero. If it fails to load, the Hero falls
// back to its normal look (no overlay, theme text colors).
export default function HeroFrame({
  imageUrl,
  children,
}: {
  imageUrl: string | null;
  children: ReactNode;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const showImage = imageUrl !== null && imageUrl !== failedUrl;

  return (
    <section
      id="home"
      className={`relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden px-8 py-20 md:px-20 ${
        showImage ? "text-white" : ""
      }`}
    >
      {showImage && (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            onError={() => setFailedUrl(imageUrl)}
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        </>
      )}

      {children}
    </section>
  );
}
