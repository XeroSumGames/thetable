"use client";

import { useState } from "react";

// Thumbnail for a generator button. Looks for /gen-<slug>.(png|jpg) in /public.
// If the image is missing it renders nothing, so the button falls back to the
// clean text-only layout. Drop an image into public/gen-<slug>.png and it
// appears automatically -- no code change needed.
export default function GenThumb({ slug, alt }: { slug: string; alt: string }) {
  const [src, setSrc] = useState<string | null>(`/gen-${slug}.png`);
  if (!src) return null;
  return (
    <img
      className="gen-thumb"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => {
        // try .jpg once, then give up and hide.
        if (src.endsWith(".png")) setSrc(`/gen-${slug}.jpg`);
        else setSrc(null);
      }}
    />
  );
}
