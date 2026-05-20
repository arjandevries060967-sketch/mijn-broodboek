"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Recipe, Ingredient, Step, Category, Difficulty, RijsMiddel } from "../data/recipes";

const CATEGORY_IMAGE_KEY: Record<string, string> = {
  Desem: "desem",
  Volkoren: "volkoren",
  "Wit brood": "wit",
  Spelt: "spelt",
  Rogge: "rogge",
  "Zoet brood": "brioche",
};

function dbToRecipe(row: any): Recipe {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    author: row.author_name || "Bakker",
    authorAvatar: (row.author_name || "B")[0].toUpperCase(),
    description: row.description,
    category: row.category as Category,
    rijsmiddel: row.rijsmiddel as RijsMiddel,
    difficulty: row.difficulty as Difficulty,
    bakTime: row.bak_time,
    totalTime: row.total_time,
    hydration: row.hydration,
    zoutPct: Number(row.zout_pct),
    rijsmiddelPct: Number(row.rijsmiddel_pct),
    totalMeel: row.total_meel,
    image: row.image_url || CATEGORY_IMAGE_KEY[row.category] || "wit",
    saved: false,
    shared: row.shared,
    rating: Number(row.rating),
    ingredients: (row.broodboek_ingredients ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((i: any): Ingredient => ({
        name: i.name,
        grams: i.grams,
        percentage: i.percentage ?? undefined,
        type: i.type,
      })),
    steps: (row.broodboek_steps ?? [])
      .sort((a: any, b: any) => a.nr - b.nr)
      .map((s: any): Step => ({
        nr: s.nr,
        title: s.title,
        description: s.description,
        duration: s.duration ?? undefined,
      })),
  };
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = useCallback(async () => {
    const { data } = await supabase
      .from("broodboek_recipes")
      .select(`
        *,
        broodboek_ingredients (id, name, grams, percentage, type, sort_order),
        broodboek_steps (nr, title, description, duration)
      `)
      .order("created_at", { ascending: false });

    if (data) setRecipes(data.map(dbToRecipe));
    setLoading(false);
  }, []);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  return { recipes, loading, refetch: fetchRecipes };
}
