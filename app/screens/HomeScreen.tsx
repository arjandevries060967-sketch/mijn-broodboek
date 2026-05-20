"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { CATEGORIES, BREAD_EMOJIS, Category, Recipe } from "../data/recipes";
import RecipeCard from "../components/RecipeCard";
import BreadImage from "../components/BreadImage";
import ScrollArea from "../components/ScrollArea";

const HEADER_PHOTO =
  "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=800&q=85";

// Nav bar: always this exact height, never changes (prevents feedback loop)
const NAV_H = 72;
// Extra hero strip that scrolls away below the nav bar
const HERO_H = 108;
// Scroll distance over which the transition completes
const FADE_RANGE = HERO_H - NAV_H; // 36px

interface Props {
  recipes: Recipe[];
  loading: boolean;
  onRecipe: (recipe: Recipe) => void;
  onNew: () => void;
  onProfile: () => void;
}

export default function HomeScreen({ recipes, loading, onRecipe, onNew, onProfile }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category | "Alles">("Alles");
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recipesOpen, setRecipesOpen] = useState(false);

  const barBgRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const heroBodyRef = useRef<HTMLDivElement>(null);

  const filtered = recipes.filter(
    (r) => activeCategory === "Alles" || r.category === activeCategory
  );
  const searchResults = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );
  const closeSearch = () => { setSearchOpen(false); setSearch(""); };

  const handleScrollChange = useCallback((scrollTop: number) => {
    const p = Math.min(1, Math.max(0, scrollTop / FADE_RANGE));
    // nav bar background: transparent → opaque glass
    if (barBgRef.current) barBgRef.current.style.opacity = String(p);
    // only "Welkom terug" sub-label fades out — "Mijn Broodboek" title stays visible
    if (subtitleRef.current)
      subtitleRef.current.style.opacity = String(Math.max(0, 1 - p * 2));
  }, []);

  return (
    <div className="flex flex-col h-full relative">

      {/* ── Zoek overlay ── */}
      {searchOpen && (
        <div
          className="absolute inset-0 z-30 flex flex-col"
          style={{ background: "rgba(14,8,2,0.96)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" }}
        >
          <div className="px-4 pt-14 pb-3">
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.40)" }}>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                autoFocus
                type="text"
                placeholder="Zoek een recept..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl pl-10 pr-11 py-3 text-sm border-0"
                style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff" }}
              />
              <button
                onClick={closeSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 glass-btn w-7 h-7 rounded-full flex items-center justify-center tap"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-stone-300">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto hide-scroll px-4 pb-8">
            {search.length > 0 ? (
              searchResults.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {searchResults.map((r) => (
                    <RecipeCard
                      key={r.id}
                      recipe={r}
                      onClick={(recipe) => { closeSearch(); onRecipe(recipe); }}
                      variant="compact"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-stone-400 font-medium">Geen recepten gevonden</p>
                  <p className="text-stone-500 text-sm mt-1">Probeer een andere zoekterm</p>
                </div>
              )
            ) : (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🍞</p>
                <p className="text-stone-300 font-medium">Zoek in jouw broodboek</p>
                <p className="text-stone-500 text-sm mt-1">Typ een naam of beschrijving</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Compact nav bar — absolutely positioned, NEVER changes height ──
           Scroll area fills the same space from y=0, hero photo shows behind it  */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex flex-col justify-end overflow-hidden"
        style={{ height: NAV_H }}
      >
        {/* Photo background — same crop as the hero photo so they look like ONE photo */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={HEADER_PHOTO}
            alt=""
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        {/* Glass overlay: starts transparent, fades to a light frosted blur as user scrolls.
            Opacity stays low so the photo remains clearly visible behind the glass. */}
        <div
          ref={barBgRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0,
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            background: "rgba(20,12,4,0.30)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        />
        {/* Single row: text left + buttons right */}
        <div className="relative flex items-center gap-3 px-4 pb-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white leading-tight truncate"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
              Mijn Broodboek
            </h1>
            <p ref={subtitleRef}
              className="text-xs font-medium leading-none mt-0.5"
              style={{ color: "rgba(255,255,255,0.65)" }}>
              Welkom terug
            </p>
          </div>
          <HeaderButtons onSearch={() => setSearchOpen(true)} onNew={onNew} onProfile={onProfile} />
        </div>
      </div>

      {/* ── Scroll area fills full height (nav bar is absolute, no flex space taken) ──
           Hero is first item in scroll and starts at y=0 so it shows behind nav bar  */}
      <ScrollArea onScrollChange={handleScrollChange}>

        {/* Hero photo — height HERO_H, extends behind the nav bar.
            object-top so it aligns pixel-for-pixel with the nav-bar photo above it. */}
        <div className="relative overflow-hidden" style={{ height: HERO_H }}>
          <Image
            src={HEADER_PHOTO}
            alt=""
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Categoriefilters */}
        <div className="px-4 pt-3 pb-1">
          {activeCategory !== "Alles" && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-400">
                Gefilterd op <span className="text-amber-400 font-semibold">{activeCategory}</span>
              </span>
              <button
                onClick={() => { setActiveCategory("Alles"); setRecipesOpen(false); }}
                className="text-xs text-stone-500 tap"
              >
                Wis ✕
              </button>
            </div>
          )}
          <div className="grid grid-cols-6 gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const emoji = BREAD_EMOJIS[cat];
              const shortLabel: Record<string, string> = {
                Desem: "Desem", Volkoren: "Volkoren", "Wit brood": "Wit",
                Spelt: "Spelt", Rogge: "Rogge", "Zoet brood": "Zoet",
              };
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(isActive ? "Alles" : cat); setRecipesOpen(false); }}
                  className="flex flex-col items-center gap-1 tap"
                >
                  <div
                    className={`w-full aspect-square rounded-2xl flex items-center justify-center text-xl transition-all ${
                      isActive ? "bg-amber-500/80 shadow-lg shadow-amber-900/50" : "glass-btn"
                    }`}
                    style={isActive ? { boxShadow: "0 2px 0 rgba(255,255,255,0.30) inset, 0 4px 16px rgba(180,100,0,0.40)" } : {}}
                  >
                    {emoji}
                  </div>
                  <span className={`text-[9px] font-medium leading-tight text-center ${isActive ? "text-amber-400" : "text-stone-400"}`}>
                    {shortLabel[cat]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Uitgelicht */}
        {activeCategory === "Alles" && (
          <div className="px-5 mt-4 mb-2">
            <h2 className="font-bold text-stone-300 text-base mb-3">Uitgelicht</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-2xl animate-pulse">🍞</span>
              </div>
            ) : recipes.length === 0 ? (
              <div className="glass rounded-3xl p-6 text-center">
                <p className="text-2xl mb-2">📝</p>
                <p className="text-stone-500 text-sm">Nog geen recepten. Maak je eerste via het +-knopje!</p>
              </div>
            ) : (
            <div className="grid grid-cols-2 gap-3">
              {recipes.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  onClick={() => onRecipe(r)}
                  className="glass rounded-3xl overflow-hidden text-left tap active:scale-[0.97] transition-transform"
                >
                  <div className="relative h-24 overflow-hidden">
                    <BreadImage imageKey={r.image} className="w-full h-full" size="sm" />
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-stone-800 text-xs leading-snug line-clamp-1">{r.title}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">{r.bakTime} · {r.hydration}%</p>
                  </div>
                </button>
              ))}
            </div>
            )}
          </div>
        )}

        {/* Klapbare receptenlijst */}
        <div className="px-5 mt-3 pb-28">
          <button
            onClick={() => setRecipesOpen(!recipesOpen)}
            className="flex items-center justify-between w-full py-3 tap active:opacity-70 transition-opacity"
          >
            <h2 className="font-bold text-stone-300 text-base text-left">
              {activeCategory === "Alles" ? "Alle recepten" : activeCategory}
              <span className="text-stone-500 font-normal ml-1.5 text-sm">({filtered.length})</span>
            </h2>
            <div className={`w-7 h-7 glass-btn rounded-full flex items-center justify-center transition-transform duration-200 ${recipesOpen ? "rotate-180" : ""}`}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-stone-400">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

          {recipesOpen && (
            <div className="flex flex-col gap-4 mt-1">
              {filtered.map((r) => (
                <RecipeCard key={r.id} recipe={r} onClick={onRecipe} />
              ))}
              {filtered.length === 0 && (
                <div className="glass rounded-3xl p-8 text-center">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="text-stone-600 font-medium">Geen recepten gevonden</p>
                  <p className="text-stone-400 text-sm mt-1">Probeer een andere categorie</p>
                </div>
              )}
              <button
                onClick={() => setRecipesOpen(false)}
                className="glass-btn rounded-2xl py-3 text-sm font-medium text-stone-400 tap flex items-center justify-center gap-1.5 mt-1"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Inklappen
              </button>
            </div>
          )}
        </div>

      </ScrollArea>
    </div>
  );
}

/* Shared button row used identically in both the nav bar and the hero body */
function HeaderButtons({ onSearch, onNew, onProfile }: { onSearch: () => void; onNew: () => void; onProfile: () => void }) {
  const btnBase: React.CSSProperties = {
    background: "rgba(20,12,4,0.60)",
    border: "1px solid rgba(255,255,255,0.22)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.40)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };
  const amberBtn: React.CSSProperties = {
    background: "linear-gradient(135deg,#f59e0b,#d97706)",
    border: "1px solid rgba(255,255,255,0.30)",
    boxShadow: "0 2px 10px rgba(180,100,0,0.50)",
  };
  const avatarBtn: React.CSSProperties = {
    background: "linear-gradient(135deg,#fbbf24,#b45309)",
    border: "1px solid rgba(255,255,255,0.30)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.30)",
    flexShrink: 0,
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onSearch}
        className="w-7 h-7 rounded-full flex items-center justify-center tap active:scale-90 transition-transform"
        style={btnBase}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        onClick={onNew}
        className="w-7 h-7 rounded-full flex items-center justify-center tap active:scale-90 transition-transform"
        style={amberBtn}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        onClick={onProfile}
        className="w-7 h-7 rounded-full flex items-center justify-center tap active:scale-90 transition-transform"
        style={avatarBtn}
      >
        <span className="text-white font-bold text-[10px]">A</span>
      </button>
    </div>
  );
}
