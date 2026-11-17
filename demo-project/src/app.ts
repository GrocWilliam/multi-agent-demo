import cors from "cors";
import express from "express";
import { createNote, getNote, listNotes } from "./store";

export const app = express();
app.use(cors());
app.use(express.json());

app.get("/notes", (_req, res) => {
  res.json(listNotes());
});

app.get("/notes/:id", (req, res) => {
  const note = getNote(req.params.id);
  if (!note) return res.status(404).json({ error: "note introuvable" });
  res.json(note);
});

app.post("/notes", (req, res) => {
  const { title, content } = req.body ?? {};
  if (!title) return res.status(400).json({ error: "title requis" });
  res.status(201).json(createNote(title, content ?? ""));
});
