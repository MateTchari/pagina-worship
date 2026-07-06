import type { WorshipEvent } from "@/lib/types";

export function getEventDateTime(event: Pick<WorshipEvent, "date" | "time">) {
  return new Date(`${event.date}T${event.time || "00:00"}`);
}

export function splitEventsByDate(events: WorshipEvent[], now = new Date()) {
  const upcoming: WorshipEvent[] = [];
  const past: WorshipEvent[] = [];

  events.forEach((event) => {
    const eventDateTime = getEventDateTime(event);
    if (Number.isNaN(eventDateTime.getTime()) || eventDateTime >= now) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  });

  return {
    upcoming,
    past: past.sort((a, b) => getEventDateTime(b).getTime() - getEventDateTime(a).getTime()),
  };
}
