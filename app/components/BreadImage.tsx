"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  imageKey: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const BREAD_PHOTOS: Record<string, string> = {
  desem:    "1509440159596-0249088772ff",
  volkoren: "1555507036-ab1f4038808a",
  wit:      "1586444248902-2f64eddc13df",
  spelt:    "1612240498936-65f5101365d2",
  rogge:    "1558461095-c95c4501ab2b",
  brioche:  "1558618666-fcd25c85cd64",
};

const BREAD_FALLBACK: Record<string, { gradient: string; emoji: string }> = {
  desem:    { gradient: "from-amber-300 via-amber-200 to-stone-100",  emoji: "🫓" },
  volkoren: { gradient: "from-stone-400 via-stone-300 to-amber-100",  emoji: "🌾" },
  wit:      { gradient: "from-yellow-200 via-amber-100 to-white",      emoji: "🍞" },
  spelt:    { gradient: "from-lime-300 via-lime-200 to-stone-100",     emoji: "🌿" },
  rogge:    { gradient: "from-stone-500 via-stone-400 to-stone-200",   emoji: "🍫" },
  brioche:  { gradient: "from-orange-300 via-amber-200 to-yellow-100", emoji: "🥐" },
};

const EMOJI_SIZE = { sm: "text-2xl", md: "text-4xl", lg: "text-6xl" };

export default function BreadImage({ imageKey, className = "", size = "md" }: Props) {
  const [failed, setFailed] = useState(false);

  const isDirectUrl = imageKey.startsWith("http") || imageKey.startsWith("/");
  const photoId = isDirectUrl ? null : BREAD_PHOTOS[imageKey];
  const fallback = BREAD_FALLBACK[imageKey] ?? { gradient: "from-amber-200 to-amber-100", emoji: "🍞" };

  if (isDirectUrl && !failed) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imageKey}
          alt=""
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  if (!photoId || failed) {
    return (
      <div className={`bg-gradient-to-br ${fallback.gradient} flex items-center justify-center ${className}`}>
        <span className={`${EMOJI_SIZE[size]} select-none`}
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.18))" }}>
          {fallback.emoji}
        </span>
      </div>
    );
  }

  const src = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=80`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 430px) 100vw, 430px"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
