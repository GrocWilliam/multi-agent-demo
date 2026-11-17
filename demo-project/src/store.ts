export interface Note {
  id: number;
  title: string;
  content: string;
}

const notes: Note[] = [
  { id: 1, title: "Bienvenue", content: "Première note de démonstration" },
  { id: 2, title: "Courses", content: "Pain, lait, café" },
];
let nextId = 3;

export const listNotes = (): Note[] => notes;

export const getNote = (rawId: string): Note | undefined => {
  if (!/^[1-9]\d*$/.test(rawId)) return undefined;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) return undefined;
  return notes.find((n) => n.id === id);
};

export const createNote = (title: string, content: string): Note => {
  const note = { id: nextId++, title, content };
  notes.push(note);
  return note;
};
