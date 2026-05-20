export type Difficulty = "Makkelijk" | "Gemiddeld" | "Gevorderd";
export type Category = "Desem" | "Volkoren" | "Wit brood" | "Spelt" | "Rogge" | "Zoet brood";
export type RijsMiddel = "Gist" | "Zuurdesem";

export interface Ingredient {
  name: string;
  grams: number;
  percentage?: number;
  type: "meel" | "water" | "zout" | "rijsmiddel" | "overig";
}

export interface Step {
  nr: number;
  title: string;
  description: string;
  duration?: string;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  author: string;
  authorAvatar: string;
  description: string;
  category: Category;
  rijsmiddel: RijsMiddel;
  difficulty: Difficulty;
  bakTime: string;
  totalTime: string;
  hydration: number;
  zoutPct: number;
  rijsmiddelPct: number;
  totalMeel: number;
  image: string;
  saved: boolean;
  shared: boolean;
  rating: number;
  ingredients: Ingredient[];
  steps: Step[];
}

export const CATEGORIES: Category[] = ["Desem", "Volkoren", "Wit brood", "Spelt", "Rogge", "Zoet brood"];

export const BREAD_COLORS: Record<Category, string> = {
  Desem: "from-amber-100 to-amber-50",
  Volkoren: "from-stone-200 to-stone-100",
  "Wit brood": "from-yellow-50 to-white",
  Spelt: "from-lime-100 to-lime-50",
  Rogge: "from-red-900/10 to-stone-100",
  "Zoet brood": "from-orange-100 to-pink-50",
};

export const BREAD_EMOJIS: Record<Category, string> = {
  Desem: "🫓",
  Volkoren: "🌾",
  "Wit brood": "🍞",
  Spelt: "🌿",
  Rogge: "🍫",
  "Zoet brood": "🥐",
};

export const BREAD_GRADIENT: Record<string, string> = {
  desem: "from-amber-200 via-amber-100 to-stone-100",
  volkoren: "from-stone-300 via-stone-200 to-amber-50",
  wit: "from-yellow-100 via-amber-50 to-white",
  spelt: "from-lime-200 via-lime-100 to-stone-50",
  rogge: "from-stone-400 via-stone-300 to-stone-100",
  brioche: "from-orange-200 via-amber-100 to-yellow-50",
};
