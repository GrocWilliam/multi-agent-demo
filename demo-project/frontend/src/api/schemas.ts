import { z } from "zod";

export const NoteSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  content: z.string(),
});
export const NotesSchema = z.array(NoteSchema);

export type Note = z.infer<typeof NoteSchema>;
