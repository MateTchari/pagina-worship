import type { EventType } from "@/lib/types";

export function defaultSectionsForType(type: EventType) {
  if (type === "VDM") return ["Alabanzas", "Adoraciones"];
  if (type === "CAMPA") return ["Plenaria 1", "Plenaria 2", "Plenaria 3"];
  return ["Ensayo"];
}

export function makeSharePath(eventId: string) {
  return `/share/${eventId}`;
}
