import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Song, UserProfile, WorshipEvent } from "@/lib/types";

const eventSelect = `
  *,
  event_sections (
    *,
    event_songs (
      *,
      song:songs (*)
    )
  )
`;

function normalizeEvent(event: WorshipEvent): WorshipEvent {
  return {
    ...event,
    event_sections: [...(event.event_sections ?? [])]
      .sort((a, b) => a.order_index - b.order_index)
      .map((section) => ({
        ...section,
        event_songs: [...(section.event_songs ?? [])].sort((a, b) => a.order_index - b.order_index),
      })),
  };
}

export async function getEvents() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("events").select(eventSelect).order("date", { ascending: true });
  if (error || !data) return [];

  return (data as unknown as WorshipEvent[]).map(normalizeEvent);
}

export async function getEventById(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("events").select(eventSelect).eq("id", id).single();
  if (error || !data) return null;

  return normalizeEvent(data as unknown as WorshipEvent);
}

export async function getSongs() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("songs").select("*").order("title", { ascending: true });
  if (error || !data) return [];

  return data as Song[];
}

export async function getCurrentUserProfile() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: profile } = await supabase
    .from("users_profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  return {
    user: userData.user,
    profile: profile as UserProfile | null,
  };
}
