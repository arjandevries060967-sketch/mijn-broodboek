"use client";

import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import { Tab } from "./types";
import { Recipe } from "./data/recipes";
import { useRecipes } from "./hooks/useRecipes";
import { useSaved } from "./hooks/useSaved";
import BottomNav from "./components/BottomNav";
import HomeScreen from "./screens/HomeScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import NewRecipeScreen from "./screens/NewRecipeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import PricingScreen from "./screens/PricingScreen";
import AuthScreen from "./screens/AuthScreen";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("home");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [prevTab, setPrevTab] = useState<Tab>("home");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? "";
  const userName = session?.user.user_metadata?.name || session?.user.email || "Bakker";
  const userEmail = session?.user.email || "";

  const { recipes, loading: recipesLoading, refetch } = useRecipes();
  const { savedIds, toggleSaved } = useSaved(userId);

  const deleteRecipe = async (id: string) => {
    await supabase.from("broodboek_recipes").delete().eq("id", id);
    refetch();
  };

  const handleRecipe = (recipe: Recipe) => {
    setPrevTab(tab);
    setSelectedRecipe(recipe);
  };

  const handleBack = () => {
    setSelectedRecipe(null);
  };

  const handleTabSelect = (newTab: Tab) => {
    setSelectedRecipe(null);
    setTab(newTab);
  };

  const phoneShell = (content: React.ReactNode) => (
    <div className="flex justify-center items-start h-dvh" style={{ background: "#160e06" }}>
      <div
        className="relative w-full max-w-sm h-full flex flex-col"
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 32px 80px rgba(0,0,0,0.18)" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=60"
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: "blur(2px) brightness(0.28) saturate(0.7)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(14,8,2,0.55)" }} />
        </div>
        <div className="relative z-50 flex items-center justify-between px-6 pt-3 pb-0 pointer-events-none select-none">
          <span className="text-[13px] font-semibold text-stone-200 tabular-nums">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-px">
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} className={`w-1 rounded-sm ${i < 3 ? "bg-stone-200" : "bg-stone-300"}`} style={{ height: h }} />
              ))}
            </div>
            <svg viewBox="0 0 16 12" className="w-4 h-3 fill-stone-700">
              <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM8 6.5a5 5 0 013.54 1.46l-1.41 1.42a3 3 0 00-4.26 0L4.46 7.96A5 5 0 018 6.5zM8 3a8 8 0 015.66 2.34l-1.42 1.42a6 6 0 00-8.48 0L2.34 5.34A8 8 0 018 3z"/>
            </svg>
            <div className="flex items-center gap-px">
              <div className="w-6 h-3 rounded-sm border border-stone-300 flex items-center px-px">
                <div className="bg-stone-200 h-2 rounded-sm w-4/5" />
              </div>
              <div className="w-px h-1.5 bg-stone-200 rounded-r-sm" />
            </div>
          </div>
        </div>
        {content}
      </div>
    </div>
  );

  if (authLoading) return phoneShell(
    <div className="relative z-10 flex-1 flex items-center justify-center">
      <span className="text-3xl animate-pulse">🍞</span>
    </div>
  );

  if (!session) return phoneShell(<AuthScreen />);

  return (
    <div className="flex justify-center items-start h-dvh" style={{ background: "#160e06" }}>
      <div
        className="relative w-full max-w-sm h-full flex flex-col"
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 32px 80px rgba(0,0,0,0.18)" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=60"
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: "blur(2px) brightness(0.28) saturate(0.7)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(14,8,2,0.55)" }} />
        </div>

        <div className="relative z-50 flex items-center justify-between px-6 pt-3 pb-0 pointer-events-none select-none">
          <span className="text-[13px] font-semibold text-stone-200 tabular-nums">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-px">
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} className={`w-1 rounded-sm ${i < 3 ? "bg-stone-200" : "bg-stone-300"}`} style={{ height: h }} />
              ))}
            </div>
            <svg viewBox="0 0 16 12" className="w-4 h-3 fill-stone-700">
              <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM8 6.5a5 5 0 013.54 1.46l-1.41 1.42a3 3 0 00-4.26 0L4.46 7.96A5 5 0 018 6.5zM8 3a8 8 0 015.66 2.34l-1.42 1.42a6 6 0 00-8.48 0L2.34 5.34A8 8 0 018 3z"/>
            </svg>
            <div className="flex items-center gap-px">
              <div className="w-6 h-3 rounded-sm border border-stone-300 flex items-center px-px">
                <div className="bg-stone-200 h-2 rounded-sm w-4/5" />
              </div>
              <div className="w-px h-1.5 bg-stone-200 rounded-r-sm" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col overflow-hidden min-h-0 rounded-none">
          {selectedRecipe ? (
            <RecipeDetailScreen
              recipe={selectedRecipe}
              onBack={handleBack}
              isSaved={savedIds.has(selectedRecipe.id)}
              onSave={() => toggleSaved(selectedRecipe.id)}
            />
          ) : tab === "home" ? (
            <HomeScreen
              recipes={recipes}
              loading={recipesLoading}
              onRecipe={handleRecipe}
              onNew={() => handleTabSelect("new")}
              onProfile={() => handleTabSelect("profile")}
            />
          ) : tab === "discover" ? (
            <DiscoverScreen
              recipes={recipes.filter((r) => r.shared)}
              onRecipe={handleRecipe}
              savedIds={savedIds}
              onSave={toggleSaved}
            />
          ) : tab === "new" ? (
            <NewRecipeScreen
              userId={userId}
              userName={userName}
              onSaved={() => { refetch(); handleTabSelect("home"); }}
            />
          ) : tab === "upgrade" ? (
            <PricingScreen />
          ) : (
            <ProfileScreen
              recipes={recipes}
              userId={userId}
              onRecipe={handleRecipe}
              savedIds={savedIds}
              onSave={toggleSaved}
              onDelete={deleteRecipe}
              userName={userName}
              userEmail={userEmail}
            />
          )}
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 z-10"
          style={{ background: "linear-gradient(to top, #160e06 0%, transparent 100%)" }} />

        <div className="relative z-20 overflow-visible">
          <BottomNav active={tab} onSelect={handleTabSelect} />
        </div>
      </div>
    </div>
  );
}
