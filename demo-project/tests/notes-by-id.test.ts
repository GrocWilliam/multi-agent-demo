import request from "supertest";
import { app } from "../src/app";

describe("GET /notes/:id (TB-01..TB-06)", () => {
  it("TB-01 id existant → 200 + Note complète", async () => {
    const res = await request(app).get("/notes/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, title: "Bienvenue", content: "Première note de démonstration" });
  });

  it("TB-02 id inconnu → 404 { error: 'note introuvable' }", async () => {
    const res = await request(app).get("/notes/9999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "note introuvable" });
  });

  it.each(["abc", "0", "-1", "1.5", "01", "1e3", "%20", "99999999999999999999"])(
    "TB-03 id invalide %s → 404 (pas 400, pas 500)",
    async (id) => {
      const res = await request(app).get(`/notes/${id}`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "note introuvable" });
    },
  );

  it("TB-04 note créée via POST récupérable par GET /notes/:id", async () => {
    const created = await request(app).post("/notes").send({ title: "Neuve", content: "xyz" });
    expect(created.status).toBe(201);
    const res = await request(app).get(`/notes/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
  });

  it("TB-05 GET /notes renvoie un tableau de Note (non-régression US-01)", async () => {
    const res = await request(app).get("/notes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toEqual(
      expect.objectContaining({ id: expect.any(Number), title: expect.any(String), content: expect.any(String) }),
    );
  });

  it("TB-06 POST sans titre → 400 (non-régression US-02)", async () => {
    const res = await request(app).post("/notes").send({ content: "x" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "title requis" });
  });
});
