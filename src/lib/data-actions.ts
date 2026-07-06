import type { EventType, Song, WorshipEvent } from "@/lib/types";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { defaultSectionsForType } from "@/lib/event-helpers";

type EventInput = Pick<WorshipEvent, "title" | "date" | "time" | "location" | "type"> & {
  description?: string;
  is_public?: boolean;
  sections?: string[];
};

export async function createEvent(input: EventInput) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { sections: inputSections, ...eventInput } = input;
  const { data: userData } = await supabase.auth.getUser();
  const { data: event, error } = await supabase
    .from("events")
    .insert({ ...eventInput, created_by: userData.user?.id, is_public: input.is_public ?? false })
    .select()
    .single();

  if (error) throw error;

  const sectionNames = inputSections?.map((section) => section.trim()).filter(Boolean);
  const sections = (sectionNames?.length ? sectionNames : defaultSectionsForType(input.type as EventType)).map((name, index) => ({
    event_id: event.id,
    name,
    order_index: index + 1,
  }));

  const { error: sectionError } = await supabase.from("event_sections").insert(sections);
  if (sectionError) throw sectionError;
  return event;
}

export async function updateEvent(id: string, input: Partial<EventInput>) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { sections: _sections, ...eventInput } = input;
  void _sections;
  const { data, error } = await supabase.from("events").update(eventInput).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteEvent(id: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

export async function createSong(input: Omit<Song, "id" | "created_at" | "updated_at">) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("songs").insert({ ...input, created_by: userData.user?.id }).select().single();
  if (error) throw error;
  return data;
}

export async function updateSong(id: string, input: Partial<Song>) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { data, error } = await supabase.from("songs").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteSong(id: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { error } = await supabase.from("songs").delete().eq("id", id);
  if (error) throw error;
}

export async function addSongToEvent(input: { event_id: string; section_id: string; song_id: string; selected_key: string; order_index: number; event_notes?: string }) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { data, error } = await supabase.from("event_songs").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateEventSong(id: string, input: { selected_key?: string; event_notes?: string; order_index?: number }) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { data, error } = await supabase.from("event_songs").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function createEventSection(input: { event_id: string; name: string; order_index: number }) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { data, error } = await supabase.from("event_sections").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateEventSection(id: string, input: { name?: string; order_index?: number }) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { data, error } = await supabase.from("event_sections").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteEventSection(id: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { error } = await supabase.from("event_sections").delete().eq("id", id);
  if (error) throw error;
}

export async function removeSongFromEvent(id: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  const { error } = await supabase.from("event_songs").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderSongs(items: Array<{ id: string; order_index: number }>) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  await Promise.all(items.map((item) => supabase.from("event_songs").update({ order_index: item.order_index }).eq("id", item.id)));
}

export async function reorderSections(items: Array<{ id: string; order_index: number }>) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase no esta configurado.");
  await Promise.all(items.map((item) => supabase.from("event_sections").update({ order_index: item.order_index }).eq("id", item.id)));
}

export async function togglePublicEvent(id: string, isPublic: boolean) {
  return updateEvent(id, { is_public: isPublic });
}

export async function copyShareLink(eventId: string) {
  const url = `${window.location.origin}/share/${eventId}`;
  await navigator.clipboard.writeText(url);
  return url;
}
