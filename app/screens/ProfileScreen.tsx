"use client";

import { useState } from "react";
import Image from "next/image";
import { Recipe } from "../data/recipes";
import { supabase } from "../lib/supabase";

const HEADER_PHOTO = "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=800&q=85";
import RecipeCard from "../components/RecipeCard";
import ScrollArea from "../components/ScrollArea";

interface Props {
  recipes: Recipe[];
  userId: string;
  onRecipe: (recipe: Recipe) => void;
  savedIds: Set<string>;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  userName: string;
  userEmail: string;
}

type ProfileTab = "mijn" | "opgeslagen";

export default function ProfileScreen({ recipes, userId, onRecipe, savedIds, onSave, onDelete, userName, userEmail }: Props) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("mijn");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const mijnRecepten = recipes.filter((r) => r.userId === userId);
  const opgeslagenRecepten = recipes.filter(
    (r) => savedIds.has(r.id) && r.userId !== userId
  );

  const visibleRecipes = activeTab === "mijn" ? mijnRecepten : opgeslagenRecepten;

  const stats = [
    { label: "Recepten", value: mijnRecepten.length },
    { label: "Opgeslagen", value: opgeslagenRecepten.length },
    { label: "Gedeeld", value: mijnRecepten.filter((r) => r.shared).length },
  ];

  const handleDeletePress = (id: string) => {
    if (confirmDeleteId === id) {
      onDelete(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId((cur) => (cur === id ? null : cur)), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-14 pb-5 sticky top-0 z-10">
        <div className="absolute inset-0 pointer-events-none">
          <Image src={HEADER_PHOTO} alt="" fill className="object-cover object-center" priority />
          <div className="absolute inset-0" style={{ background: "rgba(14,8,2,0.58)" }} />
        </div>
        <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/60">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-stone-900" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">{userName}</h1>
            <p className="text-sm text-stone-400">{userEmail}</p>
            <p className="text-xs text-amber-400 mt-0.5 font-medium">🏅 Gevorderde bakker</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="glass-btn rounded-xl px-3 py-2 tap flex items-center gap-1.5"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-stone-400">
              <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-stone-400 font-medium">Uit</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-3 text-center">
              <p className="text-xl font-bold text-stone-800">{s.value}</p>
              <p className="text-xs text-stone-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="glass-btn rounded-2xl p-1 flex gap-1">
          {(["mijn", "opgeslagen"] as ProfileTab[]).map((tab) => {
            const labels: Record<ProfileTab, string> = {
              mijn: "Mijn recepten",
              opgeslagen: "Opgeslagen",
            };
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setConfirmDeleteId(null); }}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold tap transition-all ${
                  activeTab === tab ? "bg-white/90 shadow text-stone-800" : "text-stone-400"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
        </div>
      </div>

      {/* Recipe list */}
      <ScrollArea className="px-5 pt-4 pb-28">
        {activeTab === "mijn" && confirmDeleteId && (
          <div className="glass-btn rounded-2xl px-4 py-2.5 mb-3 flex items-center gap-2">
            <span className="text-rose-400 text-sm">🗑️</span>
            <p className="text-xs text-stone-300 flex-1">Tik nogmaals op de prullenbak om te verwijderen</p>
            <button onClick={() => setConfirmDeleteId(null)} className="text-stone-500 text-xs tap">Annuleer</button>
          </div>
        )}

        {visibleRecipes.length === 0 ? (
          <div className="glass rounded-3xl p-8 text-center">
            <p className="text-3xl mb-2">{activeTab === "mijn" ? "📝" : "🔖"}</p>
            <p className="text-stone-600 font-medium">
              {activeTab === "mijn" ? "Nog geen eigen recepten" : "Nog niets opgeslagen"}
            </p>
            <p className="text-stone-400 text-sm mt-1">
              {activeTab === "mijn"
                ? "Maak je eerste recept aan via het +-knopje"
                : "Sla recepten op via het bladwijzer-icoon"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleRecipes.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onClick={onRecipe}
                variant="compact"
                isSaved={activeTab === "opgeslagen" ? true : undefined}
                onSave={activeTab === "opgeslagen" ? () => onSave(r.id) : undefined}
                onDelete={activeTab === "mijn" ? () => handleDeletePress(r.id) : undefined}
                deleteConfirming={confirmDeleteId === r.id}
              />
            ))}
          </div>
        )}

        {/* Prestaties — alleen op mijn-tab */}
        {activeTab === "mijn" && (
          <div className="mt-6">
            <h2 className="font-bold text-stone-300 text-sm mb-3">Prestaties</h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: "🫓", label: "Eerste brood", done: true },
                { icon: "🌾", label: "Desemmeester", done: true },
                { icon: "🏆", label: "5 recepten", done: false },
                { icon: "🌍", label: "Gedeeld", done: true },
                { icon: "⭐", label: "Top bakker", done: false },
                { icon: "📚", label: "Broodboek vol", done: false },
              ].map((a) => (
                <div
                  key={a.label}
                  className={`glass rounded-2xl p-3 text-center flex flex-col items-center gap-1 ${!a.done ? "opacity-40" : ""}`}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <p className="text-[10px] text-stone-600 font-medium leading-tight">{a.label}</p>
                  {a.done && <span className="text-[9px] text-emerald-600 font-bold">✓ Behaald</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
