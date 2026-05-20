"use client";

import { useState } from "react";
import { Recipe } from "../data/recipes";
import BreadImage from "../components/BreadImage";
import ScrollArea from "../components/ScrollArea";

interface Props {
  recipe: Recipe;
  onBack: () => void;
  isSaved: boolean;
  onSave: () => void;
}

type DetailTab = "ingredienten" | "werkwijze" | "logboek";

export default function RecipeDetailScreen({ recipe, onBack, isSaved, onSave }: Props) {
  const [activeTab, setActiveTab] = useState<DetailTab>("ingredienten");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (nr: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(nr)) next.delete(nr);
      else next.add(nr);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      <ScrollArea>
      {/* Hero image area */}
      <div className="relative">
        <BreadImage imageKey={recipe.image} className="w-full h-64" size="lg" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-14 left-4 w-9 h-9 glass-btn rounded-full flex items-center justify-center tap active:scale-90 transition-transform"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Save button */}
        <button
          onClick={onSave}
          className="absolute top-14 right-4 w-9 h-9 glass rounded-full flex items-center justify-center tap active:scale-90 transition-all shadow"
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

        {/* Category chip */}
        <div className="absolute bottom-4 left-4">
          <span className="glass-btn text-xs font-semibold text-white rounded-full px-3 py-1.5">
            {recipe.category} · {recipe.rijsmiddel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-5 pb-32">
        {/* Title & meta */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white leading-tight">{recipe.title}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">{recipe.authorAvatar}</span>
              </div>
              <span className="text-sm text-stone-400">door {recipe.author}</span>
            </div>
          </div>
          <button className="glass-btn rounded-xl px-3 py-2 text-xs font-semibold text-white tap">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-stone-200">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-stone-400 leading-relaxed mb-5">{recipe.description}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <StatCard icon="🌾" label="Totaal meel" value={`${recipe.totalMeel}g`} />
          <StatCard icon="💧" label="Hydratatie" value={`${recipe.hydration}%`} accent />
          <StatCard icon="⏱️" label="Totaaltijd" value={recipe.totalTime} />
          <StatCard icon="🧂" label="Zout" value={`${recipe.zoutPct}%`} />
          <StatCard icon="🌱" label="Rijsmiddel" value={`${recipe.rijsmiddelPct}%`} />
          <StatCard icon="🔥" label="Baktijd" value={recipe.bakTime} />
        </div>

        {/* Tabs */}
        <div className="glass-btn rounded-2xl p-1 flex gap-1 mb-5">
          {(["ingredienten", "werkwijze", "logboek"] as DetailTab[]).map((tab) => {
            const labels: Record<DetailTab, string> = {
              ingredienten: "Ingrediënten",
              werkwijze: "Werkwijze",
              logboek: "Logboek",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold tap transition-all ${
                  activeTab === tab
                    ? "bg-white/90 shadow text-stone-800"
                    : "text-stone-400"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "ingredienten" && (
          <div className="glass rounded-3xl overflow-hidden">
            {recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < recipe.ingredients.length - 1 ? "border-b border-stone-100/80" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{ING_ICON[ing.type]}</span>
                  <span className="text-sm font-medium text-stone-700">{ing.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-800">{ing.grams}g</span>
                  {ing.percentage !== undefined && (
                    <span className="text-xs text-amber-700 bg-amber-50 rounded-full px-1.5 py-0.5 font-medium">
                      {ing.percentage}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "werkwijze" && (
          <div className="flex flex-col gap-3">
            {recipe.steps.map((step) => {
              const done = completedSteps.has(step.nr);
              return (
                <button
                  key={step.nr}
                  onClick={() => toggleStep(step.nr)}
                  className={`glass rounded-3xl p-4 text-left tap active:scale-[0.99] transition-all ${done ? "opacity-60" : ""}`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-sm font-bold transition-all ${
                        done ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {done ? "✓" : step.nr}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`font-semibold text-sm text-stone-800 ${done ? "line-through" : ""}`}>{step.title}</p>
                        {step.duration && (
                          <span className="text-[10px] text-stone-400 bg-stone-50 rounded-full px-2 py-0.5 shrink-0">{step.duration}</span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "logboek" && (
          <div className="flex flex-col gap-3">
            <div className="glass rounded-3xl p-6 text-center">
              <p className="text-3xl mb-2">📔</p>
              <p className="font-semibold text-stone-700">Geen logboeknotities</p>
              <p className="text-sm text-stone-500 mt-1">Voeg een notitie toe na het bakken</p>
              <button className="mt-4 bg-amber-700 text-white rounded-2xl px-5 py-2.5 text-sm font-semibold tap active:scale-95 transition-all">
                + Notitie toevoegen
              </button>
            </div>
          </div>
        )}
      </div>
      </ScrollArea>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-3 text-center ${accent ? "bg-amber-50/60" : ""}`}>
      <span className="text-lg">{icon}</span>
      <p className="text-[10px] text-stone-500 mt-0.5 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-bold mt-0.5 ${accent ? "text-amber-700" : "text-stone-800"}`}>{value}</p>
    </div>
  );
}

const ING_ICON: Record<string, string> = {
  meel: "🌾",
  water: "💧",
  zout: "🧂",
  rijsmiddel: "🌱",
  overig: "✨",
};
