// Test from VS Code - Mijn Broodboek
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
            style={{ filter: "blur(2px) brightness(0.52) saturate(0.9)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(14,8,2,0.28)" }} />
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
            style={{ filter: "blur(2px) brightness(0.52) saturate(0.9)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(14,8,2,0.28)" }} />
        </div>

        <div className="relative z-10 flex-1 flex flex-col overflow-hidden min-h-0 rounded-none">
          <div
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-amber-900 shrink-0"
            style={{ background: "#fef3c7", borderBottom: "1px solid #fbbf24" }}
          >
            ⚠️ Dit is een demo-versie van Mijn Broodboek
          </div>
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
