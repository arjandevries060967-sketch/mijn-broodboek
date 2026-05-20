"use client";

import { Recipe } from "../data/recipes";
import BreadImage from "./BreadImage";

interface Props {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  variant?: "default" | "compact";
  isSaved?: boolean;
  onSave?: () => void;
  onDelete?: () => void;
  deleteConfirming?: boolean;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Makkelijk: "text-emerald-700 bg-emerald-50",
  Gemiddeld: "text-amber-700 bg-amber-50",
  Gevorderd: "text-rose-700 bg-rose-50",
};

export default function RecipeCard({
  recipe, onClick, variant = "default",
  isSaved, onSave, onDelete, deleteConfirming,
}: Props) {

  const handleCardClick = () => onClick(recipe);
  const stopAndSave = (e: React.MouseEvent) => { e.stopPropagation(); onSave?.(); };
  const stopAndDelete = (e: React.MouseEvent) => { e.stopPropagation(); onDelete?.(); };

  if (variant === "compact") {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCardClick()}
        className="glass rounded-2xl overflow-hidden flex gap-3 w-full text-left tap active:scale-[0.98] transition-transform cursor-pointer"
      >
        <BreadImage imageKey={recipe.image} className="w-20 h-20 shrink-0 rounded-xl m-2" size="sm" />
        <div className="flex-1 py-3 min-w-0">
          <div className="flex items-start gap-1">
            <p className="flex-1 font-semibold text-stone-800 text-sm leading-tight truncate">{recipe.title}</p>
            <span className="text-amber-500 text-xs shrink-0 pr-1">{"★".repeat(Math.round(recipe.rating))}</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">door {recipe.author}</p>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            <span className="text-xs text-stone-500 bg-stone-100/80 rounded-full px-2 py-0.5">{recipe.bakTime}</span>
            <span className={`text-xs rounded-full px-2 py-0.5 ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
            <span className="text-xs text-stone-500 bg-stone-100/80 rounded-full px-2 py-0.5">{recipe.hydration}% hydr.</span>
          </div>
        </div>
        {/* Actieknoppen */}
        {(onSave || onDelete) && (
          <div className="flex flex-col items-center justify-center pr-3 gap-2 shrink-0">
            {onSave && (
              <button
                onClick={stopAndSave}
                className="w-8 h-8 rounded-full glass-btn flex items-center justify-center tap active:scale-90 transition-transform"
                aria-label={isSaved ? "Verwijder uit bibliotheek" : "Sla op in bibliotheek"}
              >
                {isSaved ? (
                  <svg viewBox="0 0 20 20" fill="#b45309" className="w-4 h-4">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" stroke="#78716c" strokeWidth={1.5} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                )}
              </button>
            )}
            {onDelete && (
              <button
                onClick={stopAndDelete}
                className={`w-8 h-8 rounded-full flex items-center justify-center tap active:scale-90 transition-all text-xs font-bold ${
                  deleteConfirming
                    ? "bg-rose-500 text-white shadow shadow-rose-400/40"
                    : "glass-btn text-stone-400"
                }`}
                aria-label="Verwijder recept"
              >
                {deleteConfirming ? (
                  <span className="text-[9px] leading-none text-center">Zeker?</span>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCardClick()}
      className="glass rounded-3xl overflow-hidden w-full text-left tap active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="relative">
        <BreadImage imageKey={recipe.image} className="w-full h-44 rounded-none" size="lg" />
        {onSave && (
          <button
            onClick={stopAndSave}
            className="absolute top-3 right-3 w-9 h-9 glass rounded-full flex items-center justify-center tap active:scale-90 transition-transform shadow"
            aria-label={isSaved ? "Verwijder uit bibliotheek" : "Sla op in bibliotheek"}
          >
            {isSaved ? (
              <svg viewBox="0 0 20 20" fill="#b45309" className="w-5 h-5">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="none" stroke="#78716c" strokeWidth={1.5} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-stone-800 text-base leading-snug">{recipe.title}</h3>
            <p className="text-xs text-stone-500 mt-0.5">{recipe.category} · {recipe.rijsmiddel}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-amber-500 text-sm">{recipe.rating.toFixed(1)}</span>
            {onDelete && (
              <button
                onClick={stopAndDelete}
                className={`w-8 h-8 rounded-full flex items-center justify-center tap active:scale-90 transition-all text-xs ${
                  deleteConfirming
                    ? "bg-rose-500 text-white shadow shadow-rose-400/40"
                    : "glass-btn text-stone-400"
                }`}
              >
                {deleteConfirming ? (
                  <span className="text-[9px] leading-none">Zeker?</span>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-stone-500 mt-2 line-clamp-2">{recipe.description}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <Pill>{recipe.bakTime}</Pill>
          <Pill accent={recipe.difficulty === "Makkelijk" ? "green" : recipe.difficulty === "Gemiddeld" ? "amber" : "red"}>
            {recipe.difficulty}
          </Pill>
          <Pill>{recipe.hydration}% hydr.</Pill>
        </div>
      </div>
    </div>
  );
}

function Pill({ children, accent }: { children: React.ReactNode; accent?: "green" | "amber" | "red" }) {
  const cls =
    accent === "green"
      ? "text-emerald-700 bg-emerald-50 border-emerald-100"
      : accent === "amber"
      ? "text-amber-700 bg-amber-50 border-amber-100"
      : accent === "red"
      ? "text-rose-700 bg-rose-50 border-rose-100"
      : "text-stone-600 bg-stone-50/80 border-stone-100";
  return (
    <span className={`text-xs rounded-full px-2.5 py-0.5 border ${cls}`}>{children}</span>
  );
}
