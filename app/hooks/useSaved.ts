"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useSaved(userId: string) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("broodboek_saved")
      .select("recipe_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (data) setSavedIds(new Set(data.map((r) => r.recipe_id)));
      });
  }, [userId]);

  const toggleSaved = async (recipeId: string) => {
    const isSaved = savedIds.has(recipeId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });
    if (isSaved) {
      await supabase.from("broodboek_saved").delete()
        .eq("user_id", userId).eq("recipe_id", recipeId);
    } else {
      await supabase.from("broodboek_saved").insert({ user_id: userId, recipe_id: recipeId });
    }
  };

  return { savedIds, toggleSaved };
}
