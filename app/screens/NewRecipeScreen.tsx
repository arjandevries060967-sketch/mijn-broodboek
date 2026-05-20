"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabase";
import ScrollArea from "../components/ScrollArea";

const HEADER_PHOTO = "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=800&q=85";

interface IngredientRow {
  id: number;
  name: string;
  grams: string;
  type: "meel" | "water" | "zout" | "rijsmiddel" | "overig";
}

interface StepRow {
  id: number;
  title: string;
  description: string;
  duration: string;
}

interface Props {
  userId: string;
  userName: string;
  onSaved: () => void;
}

export default function NewRecipeScreen({ userId, userName, onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rijsmiddel, setRijsmiddel] = useState<"Gist" | "Zuurdesem">("Gist");
  const [category, setCategory] = useState("Wit brood");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { id: 1, name: "Tarwebloem", grams: "500", type: "meel" },
    { id: 2, name: "Water", grams: "325", type: "water" },
    { id: 3, name: "Zout", grams: "10", type: "zout" },
    { id: 4, name: "Droge gist", grams: "5", type: "rijsmiddel" },
  ]);
  const [steps, setSteps] = useState<StepRow[]>([
    { id: 1, title: "", description: "", duration: "" },
    { id: 2, title: "", description: "", duration: "" },
    { id: 3, title: "", description: "", duration: "" },
  ]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const totalMeel = ingredients
    .filter((i) => i.type === "meel")
    .reduce((s, i) => s + (parseFloat(i.grams) || 0), 0);

  const totalWater = ingredients
    .filter((i) => i.type === "water")
    .reduce((s, i) => s + (parseFloat(i.grams) || 0), 0);

  const totalZout = ingredients
    .filter((i) => i.type === "zout")
    .reduce((s, i) => s + (parseFloat(i.grams) || 0), 0);

  const totalRijs = ingredients
    .filter((i) => i.type === "rijsmiddel")
    .reduce((s, i) => s + (parseFloat(i.grams) || 0), 0);

  const hydration = totalMeel > 0 ? Math.round((totalWater / totalMeel) * 100) : 0;
  const zoutPct = totalMeel > 0 ? Math.round((totalZout / totalMeel) * 100 * 10) / 10 : 0;
  const rijsPct = totalMeel > 0 ? Math.round((totalRijs / totalMeel) * 100 * 10) / 10 : 0;

  const updateIng = (id: number, field: keyof IngredientRow, value: string) => {
    setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const addIng = (type: IngredientRow["type"]) => {
    const labels: Record<IngredientRow["type"], string> = {
      meel: "Nieuw meel", water: "Water", zout: "Zout", rijsmiddel: "Rijsmiddel", overig: "Toevoeging",
    };
    setIngredients((prev) => [...prev, { id: Date.now(), name: labels[type], grams: "0", type }]);
  };

  const removeIng = (id: number) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const pct = (grams: string) => {
    const g = parseFloat(grams) || 0;
    return totalMeel > 0 ? Math.round((g / totalMeel) * 100 * 10) / 10 : 0;
  };

  const updateStep = (id: number, field: keyof StepRow, value: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { id: Date.now(), title: "", description: "", duration: "" }]);
  };

  const removeStep = (id: number) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setSaveError("Geef je recept een naam.");
      setActiveStep(0);
      return;
    }
    setSaving(true);
    setSaveError(null);

    let imageUrl: string | null = null;
    if (photoFile) {
      const ext = photoFile.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("broodboek-fotos")
        .upload(path, photoFile, { cacheControl: "3600" });
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from("broodboek-fotos").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    const { data: recipe, error } = await supabase
      .from("broodboek_recipes")
      .insert({
        user_id: userId,
        author_name: userName,
        title: title.trim(),
        description: desc.trim(),
        category,
        rijsmiddel,
        difficulty: "Makkelijk",
        bak_time: "",
        total_time: "",
        hydration,
        zout_pct: zoutPct,
        rijsmiddel_pct: rijsPct,
        total_meel: totalMeel,
        image_url: imageUrl,
        shared: false,
      })
      .select()
      .single();

    if (error || !recipe) {
      setSaveError("Opslaan mislukt. Probeer opnieuw.");
      setSaving(false);
      return;
    }

    if (ingredients.length > 0) {
      await supabase.from("broodboek_ingredients").insert(
        ingredients.map((ing, idx) => ({
          recipe_id: recipe.id,
          name: ing.name,
          grams: parseInt(ing.grams) || 0,
          percentage: totalMeel > 0 ? pct(ing.grams) : null,
          type: ing.type,
          sort_order: idx,
        }))
      );
    }

    const validSteps = steps.filter((s) => s.title.trim());
    if (validSteps.length > 0) {
      await supabase.from("broodboek_steps").insert(
        validSteps.map((s, idx) => ({
          recipe_id: recipe.id,
          nr: idx + 1,
          title: s.title,
          description: s.description,
          duration: s.duration || null,
        }))
      );
    }

    setSaved(true);
    setSaving(false);
    setTimeout(() => onSaved(), 1200);
  };

  const STEPS = [
    { label: "Basisinfo", icon: "📝" },
    { label: "Ingrediënten", icon: "🌾" },
    { label: "Werkwijze", icon: "👨‍🍳" },
  ];

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-14 pb-4 sticky top-0 z-10">
        <div className="absolute inset-0 pointer-events-none">
          <Image src={HEADER_PHOTO} alt="" fill className="object-cover object-center" priority />
          <div className="absolute inset-0" style={{ background: "rgba(14,8,2,0.58)" }} />
        </div>
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">Nieuw recept</h1>
          <p className="text-sm text-stone-400 mt-0.5">Voeg een nieuw broodrecept toe</p>
          <div className="flex gap-2 mt-4">
            {STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`flex-1 tap rounded-xl py-2 text-xs font-semibold transition-all ${
                  activeStep === i
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-900/40"
                    : i < activeStep
                    ? "glass-btn text-amber-300"
                    : "glass-btn text-stone-400"
                }`}
              >
                {step.icon} {step.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ScrollArea className="pb-28 px-5 pt-5">
        {/* Step 0: Basic info */}
        {activeStep === 0 && (
          <div className="flex flex-col gap-4">
            <div className="glass rounded-3xl h-44 overflow-hidden relative tap active:brightness-90 transition-all">
              {photoPreview ? (
                <>
                  <Image src={photoPreview} alt="" fill className="object-cover" />
                  <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
                    <span className="text-white text-xs font-semibold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                      Tik om te wijzigen
                    </span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-stone-200 rounded-3xl">
                  <span className="text-3xl">📸</span>
                  <p className="text-sm font-medium text-stone-600">Broodfoto toevoegen</p>
                  <p className="text-xs text-stone-400">Tik om een foto te kiezen</p>
                </div>
              )}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
            </div>

            <div className="glass rounded-2xl p-4 flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Receptnaam</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="bijv. Klassiek Zuurdesembrood"
                className="text-base font-semibold text-stone-800 placeholder-stone-500 bg-transparent border-b border-stone-100 pb-1"
              />
            </div>

            <div className="glass rounded-2xl p-4">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-3">Rijsmiddel</label>
              <div className="flex gap-3">
                {(["Gist", "Zuurdesem"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRijsmiddel(r)}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold tap transition-all ${
                      rijsmiddel === r
                        ? "bg-amber-700 text-white shadow shadow-amber-100"
                        : "glass-btn text-stone-600"
                    }`}
                  >
                    {r === "Gist" ? "🌱 Gist" : "🫧 Zuurdesem"}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-3">Soort brood</label>
              <div className="grid grid-cols-3 gap-2">
                {["Desem", "Volkoren", "Wit brood", "Spelt", "Rogge", "Zoet brood"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`rounded-xl py-2 text-xs font-medium tap transition-all ${
                      category === c
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "glass-btn text-stone-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">Beschrijving</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Korte omschrijving voor je receptenoverzicht..."
                className="w-full text-sm text-stone-700 placeholder-stone-500 bg-transparent resize-none h-20 leading-relaxed"
              />
            </div>

            {saveError && activeStep === 0 && (
              <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.30)" }}>
                <p className="text-rose-400 text-xs">{saveError}</p>
              </div>
            )}

            <button
              onClick={() => setActiveStep(1)}
              className="w-full bg-amber-700 text-white rounded-2xl py-3.5 text-sm font-bold tap active:scale-95 transition-all shadow shadow-amber-200"
            >
              Volgende: Ingrediënten →
            </button>
          </div>
        )}

        {/* Step 1: Ingredients */}
        {activeStep === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="glass rounded-2xl p-3 text-center">
                <span className="text-base">🌾</span>
                <p className="text-[10px] text-stone-500 mt-0.5 font-medium uppercase tracking-wide">Bloem/meel</p>
                <p className="text-sm font-bold text-stone-800 mt-0.5">{totalMeel}g</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center bg-amber-50/50">
                <span className="text-base">💧</span>
                <p className="text-[10px] text-stone-500 mt-0.5 font-medium uppercase tracking-wide">Hydratatie</p>
                <p className="text-sm font-bold text-amber-700 mt-0.5">{hydration}%</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <span className="text-base">⚖️</span>
                <p className="text-[10px] text-stone-500 mt-0.5 font-medium uppercase tracking-wide">Deeggewicht</p>
                <p className="text-sm font-bold text-stone-800 mt-0.5">{ingredients.reduce((s, i) => s + (parseFloat(i.grams) || 0), 0)}g</p>
              </div>
            </div>

            {totalMeel > 0 && (
              <div className="glass rounded-2xl p-4">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Bakkerspercentages</p>
                <div className="flex flex-col gap-2">
                  <StatRow label="Bloem" value="100%" color="bg-amber-400" width="100%" />
                  <StatRow label="Hydratatie" value={`${hydration}%`} color="bg-sky-400" width={`${Math.min(hydration, 100)}%`} />
                  <StatRow label="Zout" value={`${zoutPct}%`} color="bg-stone-400" width={`${Math.min(zoutPct * 20, 100)}%`} />
                  <StatRow label="Rijsmiddel" value={`${rijsPct}%`} color="bg-emerald-400" width={`${Math.min(rijsPct * 5, 100)}%`} />
                </div>
              </div>
            )}

            <IngSection title="Bloem / meel" icon="🌾" items={ingredients.filter((i) => i.type === "meel")} onUpdate={updateIng} onRemove={removeIng} onAdd={() => addIng("meel")} addLabel="+ Meelsoort toevoegen" showPct totalMeel={totalMeel} pct={pct} />
            <IngSection title="Water / vloeistof" icon="💧" items={ingredients.filter((i) => i.type === "water")} onUpdate={updateIng} onRemove={removeIng} onAdd={() => addIng("water")} addLabel="+ Water toevoegen" showPct totalMeel={totalMeel} pct={pct} />
            <IngSection title="Zout" icon="🧂" items={ingredients.filter((i) => i.type === "zout")} onUpdate={updateIng} onRemove={removeIng} onAdd={() => addIng("zout")} addLabel="+ Zout toevoegen" showPct totalMeel={totalMeel} pct={pct} />
            <IngSection title={rijsmiddel === "Gist" ? "Gist" : "Zuurdesemstarter"} icon="🌱" items={ingredients.filter((i) => i.type === "rijsmiddel")} onUpdate={updateIng} onRemove={removeIng} onAdd={() => addIng("rijsmiddel")} addLabel="+ Rijsmiddel toevoegen" showPct totalMeel={totalMeel} pct={pct} />
            <IngSection title="Toevoegingen" icon="✨" items={ingredients.filter((i) => i.type === "overig")} onUpdate={updateIng} onRemove={removeIng} onAdd={() => addIng("overig")} addLabel="+ Toevoeging toevoegen" showPct totalMeel={totalMeel} pct={pct} />

            <div className="flex gap-3">
              <button onClick={() => setActiveStep(0)} className="flex-1 glass-btn rounded-2xl py-3.5 text-sm font-bold text-white tap active:scale-95 transition-all">← Terug</button>
              <button onClick={() => setActiveStep(2)} className="flex-1 bg-amber-700 text-white rounded-2xl py-3.5 text-sm font-bold tap active:scale-95 transition-all shadow shadow-amber-200">Werkwijze →</button>
            </div>
          </div>
        )}

        {/* Step 2: Werkwijze */}
        {activeStep === 2 && (
          <div className="flex flex-col gap-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="glass rounded-3xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-amber-700">{idx + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(step.id, "title", e.target.value)}
                    placeholder={idx === 0 ? "bijv. Autolyse" : idx === 1 ? "bijv. Kneden" : "bijv. Rijzen"}
                    className="flex-1 text-sm font-semibold text-stone-700 placeholder-stone-500 bg-transparent"
                  />
                  {steps.length > 1 && (
                    <button onClick={() => removeStep(step.id)} className="text-stone-300 tap active:text-rose-400 transition-colors p-1">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(step.id, "description", e.target.value)}
                  placeholder="Beschrijf de stap..."
                  className="w-full text-sm text-stone-600 placeholder-stone-500 bg-transparent resize-none h-16 leading-relaxed"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-stone-400">Duur:</span>
                  <input
                    type="text"
                    value={step.duration}
                    onChange={(e) => updateStep(step.id, "duration", e.target.value)}
                    placeholder="bijv. 30 min"
                    className="text-xs text-stone-600 placeholder-stone-500 bg-stone-50 rounded-lg px-2 py-1 w-24"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addStep}
              className="glass-btn rounded-2xl py-3 text-sm font-semibold text-white tap flex items-center justify-center gap-2"
            >
              <span className="text-amber-700">+</span> Stap toevoegen
            </button>

            {saveError && (
              <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.30)" }}>
                <p className="text-rose-400 text-xs">{saveError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setActiveStep(1)} className="flex-1 glass-btn rounded-2xl py-3.5 text-sm font-bold text-white tap active:scale-95 transition-all">← Terug</button>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`flex-1 rounded-2xl py-3.5 text-sm font-bold tap active:scale-95 transition-all shadow disabled:opacity-70 ${
                  saved ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-amber-700 text-white shadow-amber-200"
                }`}
              >
                {saving ? "Opslaan..." : saved ? "✓ Opgeslagen!" : "Recept opslaan"}
              </button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function StatRow({ label, value, color, width }: { label: string; value: string; color: string; width: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-stone-500 w-20 shrink-0">{label}</span>
      <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width }} />
      </div>
      <span className="text-xs font-bold text-stone-700 w-10 text-right">{value}</span>
    </div>
  );
}

interface IngSectionProps {
  title: string;
  icon: string;
  items: { id: number; name: string; grams: string; type: string }[];
  onUpdate: (id: number, field: any, value: string) => void;
  onRemove: (id: number) => void;
  onAdd: () => void;
  addLabel: string;
  showPct?: boolean;
  totalMeel: number;
  pct: (grams: string) => number;
}

function IngSection({ title, icon, items, onUpdate, onRemove, onAdd, addLabel, showPct, totalMeel, pct }: IngSectionProps) {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100/80">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-sm font-bold text-stone-700">{title}</span>
        </div>
        {showPct && totalMeel > 0 && items.length > 0 && (
          <span className="text-xs text-amber-700 font-semibold">
            {items.reduce((s, i) => s + pct(i.grams), 0).toFixed(0)}%
          </span>
        )}
      </div>
      {items.length === 0 && (
        <p className="text-xs text-stone-400 px-4 py-3">Nog niets toegevoegd</p>
      )}
      {items.map((ing) => (
        <div key={ing.id} className="flex items-center gap-2 px-4 py-2.5 border-b border-stone-50">
          <input
            type="text"
            value={ing.name}
            onChange={(e) => onUpdate(ing.id, "name", e.target.value)}
            className="flex-1 text-sm text-stone-700 bg-transparent min-w-0"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={ing.grams}
              onChange={(e) => onUpdate(ing.id, "grams", e.target.value)}
              className="text-sm font-bold text-stone-800 bg-stone-50 rounded-lg px-2 py-1 w-16 text-right"
            />
            <span className="text-xs text-stone-400">g</span>
          </div>
          {showPct && totalMeel > 0 && (
            <span className="text-xs text-amber-600 bg-amber-50 rounded-full px-1.5 py-0.5 w-12 text-center font-medium">
              {pct(ing.grams)}%
            </span>
          )}
          <button onClick={() => onRemove(ing.id)} className="text-stone-300 tap active:text-rose-400 transition-colors p-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="w-full px-4 py-2.5 text-xs font-semibold text-amber-700 tap flex items-center gap-1.5 hover:bg-amber-50/50 transition-colors"
      >
        <span>+</span> {addLabel}
      </button>
    </div>
  );
}
