"use client";

import { useState } from "react";
import Image from "next/image";
import { Category, CATEGORIES, BREAD_EMOJIS, Recipe } from "../data/recipes";

const HEADER_PHOTO = "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=800&q=85";
import RecipeCard from "../components/RecipeCard";
import ScrollArea from "../components/ScrollArea";

interface Props {
  recipes: Recipe[];
  onRecipe: (recipe: Recipe) => void;
  savedIds: Set<string>;
  onSave: (id: string) => void;
}

type FilterDifficulty = "Alle" | "Makkelijk" | "Gemiddeld" | "Gevorderd";

export default function DiscoverScreen({ recipes, onRecipe, savedIds, onSave }: Props) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<Category | "Alle">("Alle");
  const [diffFilter, setDiffFilter] = useState<FilterDifficulty>("Alle");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = recipes.filter((r) => {
    if (catFilter !== "Alle" && r.category !== catFilter) return false;
    if (diffFilter !== "Alle" && r.difficulty !== diffFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full relative">
      <div className="relative overflow-hidden px-5 pt-8 pb-3 sticky top-0 z-10">
        <div className="absolute inset-0 pointer-events-none">
          <Image src={HEADER_PHOTO} alt="" fill className="object-cover object-center" priority />
          <div className="absolute inset-0" style={{ background: "rgba(14,8,2,0.58)" }} />
        </div>
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">Ontdekken</h1>
          <p className="text-sm text-stone-400 mt-0.5">Recepten van de community</p>

          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Zoek recepten..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass-btn rounded-2xl pl-9 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-400 border-0"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`glass-btn rounded-2xl px-3.5 py-2.5 tap transition-all ${showFilters ? "bg-amber-600/30 border-amber-400/40" : ""}`}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${showFilters ? "text-amber-300" : "text-stone-300"}`}>
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.553.894l-4 2A1 1 0 016 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex flex-wrap gap-1.5">
                {(["Alle", ...CATEGORIES] as (Category | "Alle")[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCatFilter(c)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold tap transition-all ${
                      catFilter === c ? "bg-amber-600 text-white shadow shadow-amber-900/40" : "glass-btn text-stone-200"
                    }`}
                  >
                    {c === "Alle" ? "✨ Alle" : `${BREAD_EMOJIS[c as Category]} ${c}`}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(["Alle", "Makkelijk", "Gemiddeld", "Gevorderd"] as FilterDifficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiffFilter(d)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold tap transition-all ${
                      diffFilter === d ? "bg-stone-600 text-white" : "glass-btn text-stone-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="px-5 pt-4 pb-28">
        {/* Top contributors */}
        {!search && catFilter === "Alle" && diffFilter === "Alle" && (
          <div className="mb-5">
            <h2 className="font-bold text-stone-300 text-sm mb-3">Actieve bakkers</h2>
            <div className="flex gap-3 overflow-x-auto hide-scroll">
              {[
                { name: "Lisa B.", initial: "L", count: 3, color: "from-rose-400 to-pink-500" },
                { name: "Tom de W.", initial: "T", count: 2, color: "from-sky-400 to-blue-500" },
                { name: "Emma S.", initial: "E", count: 4, color: "from-emerald-400 to-green-500" },
                { name: "Hendrik R.", initial: "H", count: 1, color: "from-amber-400 to-orange-500" },
              ].map((u) => (
                <div key={u.name} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${u.color} flex items-center justify-center shadow`}>
                    <span className="text-white font-bold text-sm">{u.initial}</span>
                  </div>
                  <p className="text-[10px] text-stone-300 font-medium">{u.name}</p>
                  <p className="text-[10px] text-stone-400">{u.count} rec.</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-stone-300 text-sm">
            {filtered.length} recept{filtered.length !== 1 ? "en" : ""}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onClick={onRecipe}
              variant="compact"
              isSaved={savedIds.has(r.id)}
              onSave={() => onSave(r.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="glass rounded-3xl p-8 text-center">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-stone-600 font-medium">Geen recepten gevonden</p>
              <p className="text-stone-400 text-sm mt-1">Pas je filters aan</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
