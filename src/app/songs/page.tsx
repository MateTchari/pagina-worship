import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { SongsLibraryClient } from "@/components/SongsLibraryClient";
import { getCurrentUserProfile, getSongs } from "@/lib/queries";

export default async function SongsPage() {
  const auth = await getCurrentUserProfile();

  if (!auth) {
    redirect("/login");
  }

  const songs = await getSongs();
  const canManage = auth.profile?.role === "admin";

  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6">
        <SongsLibraryClient initialSongs={songs} canManage={canManage} />
      </main>
    </>
  );
}
