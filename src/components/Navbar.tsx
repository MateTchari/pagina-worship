import Link from "next/link";
import { BookOpen, Home, Music2, Plus } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/queries";
import { SignOutButton } from "@/components/SignOutButton";

export async function Navbar() {
  const auth = await getCurrentUserProfile();
  const role = auth?.profile?.role ?? "invitado";
  const isAdmin = role === "admin";
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home, show: true },
    { href: "/events/new", label: "Evento", icon: Plus, show: isAdmin },
    { href: "/songs", label: "Biblioteca", icon: BookOpen, show: true },
  ].filter((link) => link.show);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#101214]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href={auth ? "/dashboard" : "/"} className="flex items-center gap-2 font-semibold text-white">
          <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
            <Music2 size={22} />
          </span>
          <span className="leading-tight">360 worship</span>
        </Link>
        {auth ? (
          <div className="hidden items-center gap-2 md:flex">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
                  <Icon size={17} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        ) : null}
        {auth ? (
          <div className="flex items-center gap-2">
            <span className="hidden rounded-lg bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-wide text-emerald-200 sm:inline-flex">{role}</span>
            <SignOutButton />
          </div>
        ) : (
          <Link href="/login" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10">
            Entrar
          </Link>
        )}
      </nav>
      {auth ? (
        <div className={`grid border-t border-white/10 md:hidden ${isAdmin ? "grid-cols-3" : "grid-cols-2"}`}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="flex items-center justify-center gap-2 px-2 py-3 text-xs text-slate-300">
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </header>
  );
}
