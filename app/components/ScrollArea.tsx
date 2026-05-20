"use client";

import { useRef, useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onScrollChange?: (scrollTop: number) => void;
}

export default function ScrollArea({ children, className = "", onScrollChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  return (
    <>
      <div
        ref={ref}
        className={`flex-1 overflow-y-auto hide-scroll ${className}`}
        onScroll={() => {
          const top = ref.current?.scrollTop ?? 0;
          setShowTop(top > 160);
          onScrollChange?.(top);
        }}
      >
        {children}
      </div>
      {showTop && (
        <button
          onClick={() => ref.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute bottom-28 right-4 z-30 w-10 h-10 glass-btn rounded-full flex items-center justify-center tap active:scale-90 transition-transform"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.40)" }}
          aria-label="Terug naar boven"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-stone-200">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </>
  );
}
