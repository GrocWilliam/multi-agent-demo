import { describe, expect, it } from "vitest";
import { NoteSchema, NotesSchema } from "../src/api/schemas";

describe("schémas zod (TF-01..TF-04)", () => {
  it("TF-01 accepte une note valide (content vide autorisé)", () => {
    expect(NoteSchema.safeParse({ id: 1, title: "t", content: "" }).success).toBe(true);
  });
  it("TF-02 rejette champ manquant ou mauvais type", () => {
    expect(NoteSchema.safeParse({ id: 1, title: "t" }).success).toBe(false);
    expect(NoteSchema.safeParse({ id: "1", title: "t", content: "c" }).success).toBe(false);
    expect(NoteSchema.safeParse({ id: 1.5, title: "t", content: "c" }).success).toBe(false);
    expect(NoteSchema.safeParse({ id: 1, title: null, content: "c" }).success).toBe(false);
  });
  it("TF-03 accepte un tableau vide et rejette un non-tableau", () => {
    expect(NotesSchema.safeParse([]).success).toBe(true);
    expect(NotesSchema.safeParse({ notes: [] }).success).toBe(false);
  });
  it("TF-04 rejette un tableau contenant un élément invalide", () => {
    expect(NotesSchema.safeParse([{ id: 1, title: "t", content: "c" }, { id: 2 }]).success).toBe(false);
  });
});
