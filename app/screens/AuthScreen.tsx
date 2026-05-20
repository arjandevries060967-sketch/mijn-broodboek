"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

type AuthMode = "login" | "register";

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("E-mail of wachtwoord klopt niet.");
    } else {
      if (!name.trim()) { setError("Vul je naam in."); setLoading(false); return; }
      if (password.length < 6) { setError("Wachtwoord moet minimaal 6 tekens zijn."); setLoading(false); return; }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: name.trim() } },
      });
      if (error) setError(error.message);
      else setMessage("Check je e-mail voor een bevestigingslink!");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="relative flex flex-col h-full justify-center px-6 pb-16">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <span className="text-6xl mb-4">🍞</span>
          <h1 className="text-2xl font-bold text-white">Mijn Broodboek</h1>
          <p className="text-stone-400 text-sm mt-1">Jouw persoonlijke broodrecept app</p>
        </div>

        {/* Tab toggle */}
        <div className="glass-btn rounded-2xl p-1 flex gap-1 mb-5">
          {(["login", "register"] as AuthMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold tap transition-all ${
                mode === m ? "bg-white/90 shadow text-stone-800" : "text-stone-400"
              }`}
            >
              {m === "login" ? "Inloggen" : "Registreren"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          {mode === "register" && (
            <div className="glass rounded-2xl px-4 py-3">
              <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Naam</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="bijv. Arjan de Vries"
                className="w-full text-sm text-stone-800 bg-transparent mt-1 placeholder-stone-400"
              />
            </div>
          )}

          <div className="glass rounded-2xl px-4 py-3">
            <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jij@voorbeeld.nl"
              autoCapitalize="none"
              className="w-full text-sm text-stone-800 bg-transparent mt-1 placeholder-stone-400"
            />
          </div>

          <div className="glass rounded-2xl px-4 py-3">
            <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimaal 6 tekens"
              className="w-full text-sm text-stone-800 bg-transparent mt-1 placeholder-stone-400"
            />
          </div>

          {error && (
            <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.30)" }}>
              <p className="text-rose-400 text-xs">{error}</p>
            </div>
          )}

          {message && (
            <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.30)" }}>
              <p className="text-emerald-400 text-xs">{message}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-2xl py-3.5 text-sm font-bold text-white tap active:scale-95 transition-all mt-1 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #f59e0b, #b45309)", boxShadow: "0 4px 20px rgba(180,100,0,0.45)" }}
          >
            {loading ? "Bezig..." : mode === "login" ? "Inloggen" : "Account aanmaken"}
          </button>
        </div>
      </div>
    </div>
  );
}
