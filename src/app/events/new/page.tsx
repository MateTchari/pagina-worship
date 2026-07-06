import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { NewEventForm } from "@/components/NewEventForm";
import { getCurrentUserProfile } from "@/lib/queries";

export default async function NewEventPage() {
  const auth = await getCurrentUserProfile();

  if (!auth) {
    redirect("/login");
  }

  if (auth.profile?.role !== "admin") {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <EmptyState title="No tenes permisos para crear eventos">
            Tu usuario puede ver eventos y canciones, pero solo un admin puede crear o modificar contenido.
          </EmptyState>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-4xl gap-6 px-4 py-8 sm:px-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Crear evento</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Nuevo evento del equipo</h1>
        </div>
        <NewEventForm />
      </main>
    </>
  );
}
