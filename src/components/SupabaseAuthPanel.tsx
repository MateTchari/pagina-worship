"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function SupabaseAuthPanel() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(supabase ? "" : "Todavia falta conectar las llaves de Supabase para abrir la puerta del equipo.");
  const [loading, setLoading] = useState(false);

  function validateForm() {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setMessage("Ponenos tu email y contrasena para saber que sos parte del equipo.");
      return null;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMessage("Ese email no parece estar bien escrito.");
      return null;
    }

    if (password.length < 6) {
      setMessage("La contrasena necesita al menos 6 caracteres.");
      return null;
    }

    return { email: cleanEmail, password };
  }

  function friendlyAuthError(error: string) {
    if (error.includes("Anonymous sign-ins are disabled")) {
      return "Falta email o contrasena. No podemos dejar entrar a alguien sin nombre.";
    }

    if (error.includes("Invalid login credentials")) {
      return "Ese email o contrasena no coincide. Probemos otra vez.";
    }

    if (error.includes("User already registered")) {
      return "Ese email ya esta en el equipo. Proba iniciar sesion.";
    }

    return error;
  }

  async function signIn() {
    if (!supabase) return;
    const credentials = validateForm();
    if (!credentials) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(credentials);
    setLoading(false);

    if (error) setMessage(friendlyAuthError(error.message));
    else router.push("/dashboard");
  }

  async function signUp() {
    if (!supabase) return;
    const credentials = validateForm();
    if (!credentials) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp(credentials);
    setLoading(false);

    setMessage(error ? friendlyAuthError(error.message) : "Registro listo. Bienvenido a 360 worship.");
  }

  return (
    <div className="mx-auto grid w-full max-w-md gap-4 rounded-lg border border-white/10 bg-[#171a1d] p-5">
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none"
        placeholder="Email"
        type="email"
        autoComplete="email"
        required
      />
      <input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none"
        placeholder="Contrasena"
        type="password"
        autoComplete="current-password"
        minLength={6}
        required
      />
      {message ? <p className="rounded-lg bg-amber-400/10 p-3 text-sm text-amber-100">{message}</p> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        <button onClick={signIn} disabled={!supabase || loading} className="min-h-12 rounded-lg bg-emerald-400 font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">Iniciar sesion</button>
        <button onClick={signUp} disabled={!supabase || loading} className="min-h-12 rounded-lg border border-white/10 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">Registrarse</button>
      </div>
    </div>
  );
}
