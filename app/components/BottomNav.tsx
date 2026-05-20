"use client";

import { Tab } from "../types";

interface Props {
  active: Tab;
  onSelect: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    id: "discover",
    label: "Ontdekken",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "new",
    label: "Nieuw",
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-400/40 -mt-4">
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
          <path fillRule="evenodd" d="M12 2a1 1 0 011 1v8h8a1 1 0 110 2h-8v8a1 1 0 11-2 0v-8H3a1 1 0 110-2h8V3a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </div>
    ),
  },
  {
    id: "upgrade",
    label: "Pro",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M2.394 13.742l2.954-10.722A.5.5 0 015.83 2.72l3.55 3.227 2.225-4.45A.5.5 0 0112 1.25a.5.5 0 01.394.247l2.226 4.45 3.55-3.227a.5.5 0 01.484-.1.5.5 0 01.347.4l2.953 10.722a.5.5 0 01-.481.626H2.875a.5.5 0 01-.48-.626zM21 17a1 1 0 010 2H3a1 1 0 010-2h18zm-2 4a1 1 0 010 2H5a1 1 0 010-2h14z"/>
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Mijn boek",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zM3 19c0-3.866 4.029-7 9-7s9 3.134 9 7v1H3v-1z"/>
      </svg>
    ),
  },
];

export default function BottomNav({ active, onSelect }: Props) {
  return (
    <nav className="flex justify-around items-end pb-safe pt-3 px-2">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const isNew = tab.id === "new";
        const isUpgrade = tab.id === "upgrade";
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`flex flex-col items-center gap-0.5 pb-0.5 tap min-w-[60px] transition-all ${
              isNew ? "pb-2" : ""
            }`}
          >
            <span className={`transition-colors ${
              isNew ? "" : isActive ? "text-amber-400" : isUpgrade ? "text-amber-600" : "text-stone-400"
            }`}>
              {tab.icon}
            </span>
            {!isNew && (
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-amber-400" : isUpgrade ? "text-amber-700" : "text-stone-500"
                }`}
              >
                {tab.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
