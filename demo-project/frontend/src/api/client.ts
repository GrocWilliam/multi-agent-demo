import type { ZodType } from "zod";
import { NoteSchema, NotesSchema, type Note } from "./schemas";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

export class NetworkError extends Error {}
export class NotFoundError extends Error {}
export class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP ${status}`);
  }
}
export class InvalidResponseError extends Error {}

async function request<T>(path: string, schema: ZodType<T>, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { headers: { Accept: "application/json" }, signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new NetworkError("réseau");
  }
  if (res.status === 404) throw new NotFoundError("introuvable");
  if (!res.ok) throw new HttpError(res.status);
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new InvalidResponseError("JSON invalide");
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) throw new InvalidResponseError("schéma non conforme");
  return parsed.data;
}

export const fetchNotes = (signal?: AbortSignal): Promise<Note[]> =>
  request("/notes", NotesSchema, signal);

export const fetchNote = (id: string, signal?: AbortSignal): Promise<Note> =>
  request(`/notes/${encodeURIComponent(id)}`, NoteSchema, signal);
