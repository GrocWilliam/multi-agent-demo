import { describe, expect, it, vi } from "vitest";
import {
  fetchNote,
  fetchNotes,
  HttpError,
  InvalidResponseError,
  NetworkError,
  NotFoundError,
} from "../src/api/client";

const note = { id: 1, title: "A", content: "B" };
const resp = (body: unknown, status = 200) =>
  new Response(typeof body === "string" ? body : JSON.stringify(body), { status });

describe("client API (TC-01..TC-09)", () => {
  it("TC-01 fetchNotes retourne les notes validées et appelle /api/notes", async () => {
    const f = vi.fn().mockResolvedValue(resp([note]));
    vi.stubGlobal("fetch", f);
    await expect(fetchNotes()).resolves.toEqual([note]);
    expect(f.mock.calls[0][0]).toBe("/api/notes");
  });
  it("TC-02 fetchNote retourne la note et encode l'id", async () => {
    const f = vi.fn().mockImplementation(async () => resp(note));
    vi.stubGlobal("fetch", f);
    await expect(fetchNote("1")).resolves.toEqual(note);
    await fetchNote("a/b");
    expect(f.mock.calls[1][0]).toBe("/api/notes/a%2Fb");
  });
  it("TC-03 404 → NotFoundError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(resp({ error: "x" }, 404)));
    await expect(fetchNote("99")).rejects.toBeInstanceOf(NotFoundError);
  });
  it("TC-04 500 → HttpError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(resp({}, 500)));
    await expect(fetchNotes()).rejects.toBeInstanceOf(HttpError);
  });
  it("TC-05 erreur réseau → NetworkError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fail")));
    await expect(fetchNotes()).rejects.toBeInstanceOf(NetworkError);
  });
  it("TC-06 JSON invalide → InvalidResponseError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(resp("<html>")));
    await expect(fetchNotes()).rejects.toBeInstanceOf(InvalidResponseError);
  });
  it("TC-07 réponse non conforme au schéma → InvalidResponseError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => resp([{ id: "x" }])));
    await expect(fetchNotes()).rejects.toBeInstanceOf(InvalidResponseError);
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => resp({ id: 1 })));
    await expect(fetchNote("1")).rejects.toBeInstanceOf(InvalidResponseError);
  });
  it("TC-08 AbortError est propagée (pas convertie en NetworkError)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("abort", "AbortError")));
    await expect(fetchNotes()).rejects.toMatchObject({ name: "AbortError" });
  });
  it("TC-09 404 sur la liste → NotFoundError (traitée comme erreur par la page)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(resp({}, 404)));
    await expect(fetchNotes()).rejects.toBeInstanceOf(NotFoundError);
  });
});
