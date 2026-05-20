"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollArea from "../components/ScrollArea";

const HEADER_PHOTO = "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=800&q=85";

type Plan = "maandelijks" | "jaarlijks";

const PLANS = {
  pro: { maandelijks: 4.99, jaarlijks: 39.99 },
  meester: { maandelijks: 9.99, jaarlijks: 79.99 },
};

const PRO_FEATURES = [
  { label: "Onbeperkt recepten bewaren", included: true },
  { label: "Volledige statistieken & percentages", included: true },
  { label: "Logboek per baksessie", included: true },
  { label: "Community recepten delen", included: true },
  { label: "Recepten exporteren (PDF)", included: true },
  { label: "AI receptassistent", included: false },
  { label: "Exclusieve masterclass recepten", included: false },
];

const MEESTER_FEATURES = [
  { label: "Alles van Bakker Pro", included: true },
  { label: "AI receptassistent", included: true },
  { label: "Exclusieve masterclass recepten", included: true },
  { label: "Meerdere bakprofielen", included: true },
  { label: "Prioriteit support", included: true },
  { label: "Vroege toegang tot nieuwe functies", included: true },
];

const FREE_FEATURES = [
  { label: "5 recepten bewaren", included: true },
  { label: "Basis broodstatistieken", included: true },
  { label: "Community recepten bekijken", included: true },
  { label: "Logboek bijhouden", included: false },
  { label: "Recepten delen", included: false },
  { label: "Exporteren & AI assistent", included: false },
];

export default function PricingScreen() {
  const [billingPlan, setBillingPlan] = useState<Plan>("jaarlijks");
  const [selected, setSelected] = useState<"gratis" | "pro" | "meester">("pro");

  const proPrice = PLANS.pro[billingPlan];
  const meesterPrice = PLANS.meester[billingPlan];
  const proSave = Math.round((PLANS.pro.maandelijks * 12 - PLANS.pro.jaarlijks));
  const meesterSave = Math.round((PLANS.meester.maandelijks * 12 - PLANS.meester.jaarlijks));

  return (
    <div className="flex flex-col h-full relative">

      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-8 pb-3 shrink-0">
        <div className="absolute inset-0 pointer-events-none">
          <Image src={HEADER_PHOTO} alt="" fill className="object-cover object-center" priority />
          <div className="absolute inset-0" style={{ background: "rgba(14,8,2,0.58)" }} />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-900/60"
              style={{ background: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)" }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M2.394 13.742l2.954-10.722A.5.5 0 015.83 2.72l3.55 3.227 2.225-4.45A.5.5 0 0112 1.25a.5.5 0 01.394.247l2.226 4.45 3.55-3.227a.5.5 0 01.484-.1.5.5 0 01.347.4l2.953 10.722a.5.5 0 01-.481.626H2.875a.5.5 0 01-.48-.626zM21 17a1 1 0 010 2H3a1 1 0 010-2h18zm-2 4a1 1 0 010 2H5a1 1 0 010-2h14z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">Mijn Broodboek Pro</h1>
              <p className="text-xs text-stone-400 mt-0.5">Word een echte meesterbakker</p>
            </div>
          </div>
          <div className="glass-btn rounded-2xl p-1 flex gap-1">
            {(["maandelijks", "jaarlijks"] as Plan[]).map((p) => (
              <button
                key={p}
                onClick={() => setBillingPlan(p)}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold tap transition-all flex items-center justify-center gap-1.5 ${
                  billingPlan === p ? "bg-white/90 shadow text-stone-800" : "text-stone-400"
                }`}
              >
                {p === "maandelijks" ? "Maandelijks" : "Jaarlijks"}
                {p === "jaarlijks" && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    billingPlan === "jaarlijks" ? "bg-amber-500 text-white" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    -33%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ScrollArea className="px-4 pt-4 pb-28">

        {/* ── Gratis plan ── */}
        <PlanCard
          name="Starter"
          badge={null}
          price="Gratis"
          priceDetail="Voor altijd"
          features={FREE_FEATURES}
          isSelected={selected === "gratis"}
          onSelect={() => setSelected("gratis")}
          ctaLabel="Doorgaan gratis"
          ctaStyle="secondary"
          accentColor={null}
        />

        {/* ── Bakker Pro plan ── */}
        <div className="mt-3">
          <PlanCard
            name="Bakker Pro"
            badge="Meest gekozen"
            price={`€${proPrice.toFixed(2).replace(".", ",")}`}
            priceDetail={billingPlan === "maandelijks" ? "per maand" : `per jaar · bespaar €${proSave}`}
            features={PRO_FEATURES}
            isSelected={selected === "pro"}
            onSelect={() => setSelected("pro")}
            ctaLabel="Begin 7-daagse proefperiode"
            ctaStyle="primary"
            accentColor="amber"
          />
        </div>

        {/* ── Meester plan ── */}
        <div className="mt-3">
          <PlanCard
            name="Meester"
            badge="Compleet pakket"
            price={`€${meesterPrice.toFixed(2).replace(".", ",")}`}
            priceDetail={billingPlan === "maandelijks" ? "per maand" : `per jaar · bespaar €${meesterSave}`}
            features={MEESTER_FEATURES}
            isSelected={selected === "meester"}
            onSelect={() => setSelected("meester")}
            ctaLabel="Probeer 7 dagen gratis"
            ctaStyle="gold"
            accentColor="gold"
          />
        </div>

        {/* Garanties */}
        <div className="mt-5 glass rounded-3xl p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: "🔒", label: "Veilig betalen", sub: "via App Store" },
              { icon: "↩️", label: "Annuleer altijd", sub: "geen verplichtingen" },
              { icon: "🍞", label: "Proefperiode", sub: "7 dagen gratis" },
            ].map((g) => (
              <div key={g.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{g.icon}</span>
                <p className="text-[11px] font-semibold text-stone-700 leading-tight">{g.label}</p>
                <p className="text-[10px] text-stone-500 leading-tight">{g.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vergelijkingstabel */}
        <div className="mt-4 glass rounded-3xl overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100/80">
            <p className="text-sm font-bold text-stone-700">Alle functies vergelijken</p>
          </div>
          {[
            { feature: "Recepten bewaren", free: "5", pro: "Onbeperkt", meester: "Onbeperkt" },
            { feature: "Community", free: "Bekijken", pro: "Delen & bekijken", meester: "Delen & bekijken" },
            { feature: "Logboek", free: "—", pro: "✓", meester: "✓" },
            { feature: "PDF export", free: "—", pro: "✓", meester: "✓" },
            { feature: "AI assistent", free: "—", pro: "—", meester: "✓" },
            { feature: "Masterclasses", free: "—", pro: "—", meester: "✓" },
          ].map((row, i, arr) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4 px-4 py-2.5 ${i < arr.length - 1 ? "border-b border-stone-50" : ""}`}
            >
              <span className="text-xs text-stone-600 col-span-1">{row.feature}</span>
              <span className="text-xs text-stone-500 text-center">{row.free}</span>
              <span className={`text-xs text-center font-medium ${row.pro === "✓" || row.pro === "Onbeperkt" || row.pro.includes("Delen") ? "text-amber-700" : "text-stone-400"}`}>{row.pro}</span>
              <span className={`text-xs text-center font-medium ${row.meester === "✓" || row.meester === "Onbeperkt" || row.meester.includes("Delen") ? "text-amber-700" : "text-stone-400"}`}>{row.meester}</span>
            </div>
          ))}
          <div className="grid grid-cols-4 px-4 py-2 bg-stone-50/50">
            <span className="text-[10px] text-stone-400 col-span-1">Plan</span>
            <span className="text-[10px] text-stone-400 text-center">Gratis</span>
            <span className="text-[10px] text-amber-600 text-center font-semibold">Pro</span>
            <span className="text-[10px] text-amber-700 text-center font-semibold">Meester</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-4 mb-2">
          <p className="text-xs text-stone-500 text-center leading-relaxed px-4">
            Abonnementen worden automatisch verlengd. Je kunt altijd opzeggen via je App Store-instellingen.
            Prijzen zijn inclusief btw.
          </p>
        </div>

      </ScrollArea>
    </div>
  );
}

/* ── PlanCard component ── */
interface PlanCardProps {
  name: string;
  badge: string | null;
  price: string;
  priceDetail: string;
  features: { label: string; included: boolean }[];
  isSelected: boolean;
  onSelect: () => void;
  ctaLabel: string;
  ctaStyle: "primary" | "secondary" | "gold";
  accentColor: "amber" | "gold" | null;
}

function PlanCard({
  name, badge, price, priceDetail, features,
  isSelected, onSelect, ctaLabel, ctaStyle, accentColor,
}: PlanCardProps) {
  const borderStyle =
    accentColor === "amber"
      ? { border: "1.5px solid rgba(217,119,6,0.60)", boxShadow: "0 0 0 1px rgba(217,119,6,0.15), 0 12px 48px rgba(0,0,0,0.30), 0 4px 24px rgba(180,100,0,0.18)" }
      : accentColor === "gold"
      ? { border: "1.5px solid rgba(180,130,0,0.45)", boxShadow: "0 12px 48px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.14)" }
      : {};

  return (
    <div
      className="glass rounded-3xl overflow-hidden tap active:scale-[0.995] transition-transform"
      style={borderStyle}
      onClick={onSelect}
    >
      {/* Plan header */}
      <div className={`px-5 pt-4 pb-4 ${accentColor === "amber" ? "bg-amber-50/40" : accentColor === "gold" ? "bg-yellow-50/20" : ""}`}>
        <div className="flex items-start justify-between mb-1">
          <span className="text-base font-bold text-stone-800">{name}</span>
          {badge && (
            <span
              className="text-[10px] font-bold uppercase tracking-wide rounded-full px-2.5 py-1"
              style={
                accentColor === "amber"
                  ? { background: "rgba(217,119,6,0.15)", color: "#b45309" }
                  : { background: "rgba(120,100,0,0.12)", color: "#78716c" }
              }
            >
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-3xl font-bold text-stone-900">{price}</span>
          {price !== "Gratis" && (
            <span className="text-xs text-stone-500">{priceDetail}</span>
          )}
        </div>
        {price === "Gratis" && (
          <span className="text-xs text-stone-500">{priceDetail}</span>
        )}
      </div>

      {/* Features */}
      <div className="px-5 pb-4 border-t border-stone-100/80">
        <div className="flex flex-col gap-2 pt-3">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-2.5">
              <span className={`shrink-0 text-base leading-none ${f.included ? "text-emerald-500" : "text-stone-300"}`}>
                {f.included ? "✓" : "—"}
              </span>
              <span className={`text-xs ${f.included ? "text-stone-700" : "text-stone-400"}`}>
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={`w-full rounded-2xl py-3.5 text-sm font-bold tap active:scale-95 transition-all ${
            ctaStyle === "primary"
              ? "bg-amber-600 text-white shadow-lg shadow-amber-900/40"
              : ctaStyle === "gold"
              ? "bg-gradient-to-r from-amber-700 to-yellow-700 text-white shadow-lg shadow-amber-900/30"
              : "glass-btn text-stone-500"
          }`}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
