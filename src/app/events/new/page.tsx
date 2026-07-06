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
          <EmptyState title="Este espacio lo preparan los admins">
            Podes ver canciones y eventos del equipo, pero la organizacion de 360 worship queda en manos de los admins.
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
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Preparar agenda</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Nuevo encuentro de 360 worship</h1>
        </div>
        <NewEventForm />
      </main>
    </>
  );
}
