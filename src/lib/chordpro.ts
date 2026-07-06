const SHARP_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const NOTE_TO_INDEX: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export type ParsedChordLine = {
  raw: string;
  parts: Array<{ chord?: string; lyric: string }>;
};

function normalizeShift(index: number) {
  return ((index % 12) + 12) % 12;
}

function shouldPreferFlats(chord: string) {
  return /b/.test(chord) && !/#/.test(chord);
}

export function transposeRoot(root: string, semitones: number, preferFlats = false) {
  const index = NOTE_TO_INDEX[root];
  if (index === undefined) return root;
  const scale = preferFlats ? FLAT_NOTES : SHARP_NOTES;
  return scale[normalizeShift(index + semitones)];
}

export function transposeChord(chord: string, semitones: number) {
  return chord
    .split("/")
    .map((segment) => {
      const match = segment.match(/^([A-G](?:#|b)?)(.*)$/);
      if (!match) return segment;
      const [, root, suffix] = match;
      return `${transposeRoot(root, semitones, shouldPreferFlats(chord))}${suffix}`;
    })
    .join("/");
}

export function transposeChordPro(input: string, semitones: number) {
  return input.replace(/\[([^\]]+)]/g, (_match, chord: string) => {
    return `[${transposeChord(chord, semitones)}]`;
  });
}

export function parseChordPro(input: string): ParsedChordLine[] {
  return input.split(/\r?\n/).map((line) => {
    const parts: ParsedChordLine["parts"] = [];
    const regex = /\[([^\]]+)]([^\[]*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ lyric: line.slice(lastIndex, match.index) });
      }
      parts.push({ chord: match[1], lyric: match[2] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push({ lyric: line.slice(lastIndex) });
    }

    return {
      raw: line,
      parts: parts.length ? parts : [{ lyric: line }],
    };
  });
}

export function semitoneDistance(fromKey: string, toKey: string) {
  const from = NOTE_TO_INDEX[fromKey];
  const to = NOTE_TO_INDEX[toKey];
  if (from === undefined || to === undefined) return 0;
  return normalizeShift(to - from);
}

export const MUSICAL_KEYS = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"];
