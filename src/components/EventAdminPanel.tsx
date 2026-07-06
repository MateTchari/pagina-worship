"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import { createEventSection, deleteEvent, deleteEventSection, updateEvent, updateEventSection } from "@/lib/data-actions";
import type { EventType, WorshipEvent } from "@/lib/types";

type EditableSection = {
  id: string;
  name: string;
  isNew?: boolean;
};

export function EventAdminPanel({ event }: { event: WorshipEvent }) {
  const router = useRouter();
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [location, setLocation] = useState(event.location);
  const [type, setType] = useState<EventType>(event.type);
  const [description, setDescription] = useState(event.description ?? "");
  const [isPublic, setIsPublic] = useState(event.is_public);
  const [sections, setSections] = useState<EditableSection[]>(event.event_sections.map((section) => ({ id: section.id, name: section.name })));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanSections = useMemo(() => sections.map((section) => ({ ...section, name: section.name.trim() })).filter((section) => section.name), [sections]);

  function addSection() {
    setSections((current) => [...current, { id: `new-${Date.now()}`, name: type === "CAMPA" ? `Plenaria ${current.length + 1}` : "Nueva seccion", isNew: true }]);
  }

  function updateSectionName(id: string, name: string) {
    setSections((current) => current.map((section) => section.id === id ? { ...section, name } : section));
  }

  async function removeSection(section: EditableSection) {
    const ok = window.confirm(`Eliminar "${section.name}"? Tambien se eliminan las canciones agregadas en esa seccion.`);
    if (!ok) return;

    if (section.isNew) {
      setSections((current) => current.filter((item) => item.id !== section.id));
      return;
    }

    try {
      await deleteEventSection(section.id);
      setSections((current) => current.filter((item) => item.id !== section.id));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar la seccion.");
    }
  }

  async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (!title.trim() || !date || !time || !location.trim()) {
      setMessage("Completa titulo, fecha, hora y lugar.");
      return;
    }

    if (cleanSections.length === 0) {
      setMessage("El evento necesita al menos una seccion.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await updateEvent(event.id, {
        title: title.trim(),
        date,
        time,
        location: location.trim(),
        type,
        description: description.trim() || undefined,
        is_public: isPublic,
      });

      await Promise.all(cleanSections.map((section, index) => {
        if (section.isNew) {
          return createEventSection({ event_id: event.id, name: section.name, order_index: index + 1 });
        }

        return updateEventSection(section.id, { name: section.name, order_index: index + 1 });
      }));

      setMessage("Evento actualizado.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar el evento.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEvent() {
    const ok = window.confirm(`Eliminar definitivamente "${event.title}"? Esta accion no se puede deshacer.`);
    if (!ok) return;

    setLoading(true);
    try {
      await deleteEvent(event.id);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar el evento.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-white/10 bg-[#171a1d] p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold text-white">Editar evento</h2>
        <button type="button" onClick={handleDeleteEvent} disabled={loading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-400/30 px-3 text-sm font-medium text-red-200 hover:bg-red-400/10 disabled:opacity-50">
          <Trash2 size={16} />
          Eliminar evento
        </button>
      </div>
      <input value={title} onChange={(inputEvent) => setTitle(inputEvent.target.value)} className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" placeholder="Titulo" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input value={date} onChange={(inputEvent) => setDate(inputEvent.target.value)} type="date" className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" />
        <input value={time} onChange={(inputEvent) => setTime(inputEvent.target.value)} type="time" className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" />
      </div>
      <input value={location} onChange={(inputEvent) => setLocation(inputEvent.target.value)} className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" placeholder="Lugar" />
      <select value={type} onChange={(inputEvent) => setType(inputEvent.target.value as EventType)} className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none">
        <option value="VDM">VDM</option>
        <option value="CAMPA">CAMPA</option>
        <option value="OTRO">OTRO</option>
      </select>
      <textarea value={description} onChange={(inputEvent) => setDescription(inputEvent.target.value)} className="min-h-24 rounded-lg border border-white/10 bg-black/20 p-3 text-white outline-none" placeholder="Descripcion" />
      <label className="flex items-center gap-3 rounded-lg bg-white/5 p-3 text-sm text-slate-200">
        <input type="checkbox" checked={isPublic} onChange={(inputEvent) => setIsPublic(inputEvent.target.checked)} className="size-4 accent-emerald-400" />
        Evento publico por link compartido
      </label>
      <div className="rounded-lg bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-300">Secciones / plenarias</p>
          <button type="button" onClick={addSection} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
            <Plus size={16} />
            Agregar
          </button>
        </div>
        <div className="grid gap-2">
          {sections.map((section) => (
            <div key={section.id} className="flex gap-2">
              <input value={section.name} onChange={(inputEvent) => updateSectionName(section.id, inputEvent.target.value)} className="min-h-11 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" />
              <button type="button" title="Eliminar seccion" onClick={() => removeSection(section)} className="rounded-lg bg-white/10 px-3 text-white hover:bg-white/15">
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      </div>
      {message ? <p className="rounded-lg bg-amber-400/10 p-3 text-sm text-amber-100">{message}</p> : null}
      <button disabled={loading} type="submit" className="inline-flex min-h-12 w-fit items-center gap-2 rounded-lg bg-emerald-400 px-4 font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
        <Save size={18} />
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
