export type UserRole = "admin" | "musico" | "invitado";

export type EventType = "VDM" | "CAMPA" | "OTRO";

export type SongCategory =
  | "Alabanza"
  | "Adoracion"
  | "Rapida"
  | "Lenta"
  | "Ministracion"
  | "Santa Cena"
  | "Ofrenda"
  | "Juvenil"
  | "Otro";

export type Song = {
  id: string;
  title: string;
  artist: string;
  category: SongCategory;
  default_key: string;
  original_key: string;
  bpm?: number;
  time_signature?: string;
  capo?: string;
  tags: string[];
  youtube_url?: string;
  spotify_url?: string;
  cifraclub_url?: string;
  lyrics_chords: string;
  internal_notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export type EventSong = {
  id: string;
  event_id: string;
  section_id: string;
  song_id: string;
  selected_key: string;
  order_index: number;
  event_notes?: string;
  song: Song;
};

export type EventSection = {
  id: string;
  event_id: string;
  name: string;
  order_index: number;
  created_at: string;
  event_songs: EventSong[];
};

export type WorshipEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  description?: string;
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  event_sections: EventSection[];
};

export type PracticeStatus = {
  id: string;
  user_id: string;
  event_id: string;
  song_id: string;
  practiced: boolean;
  updated_at: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  name: string;
  role: UserRole;
  created_at: string;
};
