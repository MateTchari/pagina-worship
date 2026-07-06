import { redirect } from "next/navigation";
import { FullscreenPerformanceMode } from "@/components/FullscreenPerformanceMode";
import { getCurrentUserProfile, getEventById } from "@/lib/queries";

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getCurrentUserProfile();

  if (!auth) {
    redirect("/login");
  }

  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return <main className="grid min-h-screen place-items-center bg-[#101214] text-white">Evento no encontrado.</main>;
  }

  return <FullscreenPerformanceMode event={event} />;
}
