import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { ErrorBoundary } from "../src/components/ui/ErrorBoundary";
import { copy } from "../src/copy";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const notes = [
  { id: 1, title: "Bienvenue", content: "Première note" },
  { id: 2, title: "Courses", content: "Pain, lait, café" },
];

/** fetch routé par chemin ; chaque valeur est une fonction (nouvelle Response à chaque appel). */
function mockApi(routes: Record<string, () => Response | Promise<Response>>) {
  const f = vi.fn(async (url: string) => {
    const h = routes[url];
    if (!h) return json({ error: "x" }, 404);
    return h();
  });
  vi.stubGlobal("fetch", f);
  return f;
}

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe("US-03 liste", () => {
  it("TA-01 affiche toutes les notes avec leur titre", async () => {
    mockApi({ "/api/notes": () => json(notes) });
    renderAt("/");
    expect(await screen.findByRole("heading", { name: "Bienvenue" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("TA-02 contenu long : aperçu tronqué par CSS (line-clamp), liste présente", async () => {
    const long = "mot ".repeat(2000);
    mockApi({ "/api/notes": () => json([{ id: 1, title: "Long", content: long }]) });
    renderAt("/");
    const link = await screen.findByRole("link", { name: /Long/ });
    const p = link.querySelector("p")!;
    expect(p.className).toContain("line-clamp-3");
    expect(p.className).toContain("break-words");
  });

  it("TA-03 le rechargement (remontage) refait l'appel et affiche la liste à jour", async () => {
    let data = notes;
    const f = mockApi({ "/api/notes": () => json(data) });
    const first = renderAt("/");
    await screen.findByText("Bienvenue");
    first.unmount();
    data = [...notes, { id: 3, title: "Nouvelle", content: "" }];
    renderAt("/");
    expect(await screen.findByText("Nouvelle")).toBeInTheDocument();
    expect(f).toHaveBeenCalledTimes(2);
  });
});

describe("US-04 détail", () => {
  it("TA-04 sélection d'une note → titre et contenu complets", async () => {
    const full = "Contenu complet\nsur deux lignes";
    mockApi({
      "/api/notes": () => json([{ id: 1, title: "Bienvenue", content: full }]),
      "/api/notes/1": () => json({ id: 1, title: "Bienvenue", content: full }),
    });
    renderAt("/");
    await userEvent.click(await screen.findByRole("link", { name: /Bienvenue/ }));
    expect(await screen.findByRole("heading", { level: 1, name: "Bienvenue" })).toBeInTheDocument();
    expect(screen.getByText(/Contenu complet/).textContent).toBe(full);
  });

  it("TA-05 retour à la liste depuis le détail", async () => {
    mockApi({
      "/api/notes": () => json(notes),
      "/api/notes/1": () => json(notes[0]),
    });
    renderAt("/notes/1");
    await userEvent.click(await screen.findByRole("link", { name: copy.back }));
    expect(await screen.findByRole("heading", { name: "Courses" })).toBeInTheDocument();
  });

  it("TA-06 note inexistante → message « introuvable » + lien retour (pas de Réessayer)", async () => {
    mockApi({ "/api/notes": () => json(notes) });
    renderAt("/notes/999");
    expect(await screen.findByRole("status")).toHaveTextContent(copy.notFound);
    expect(screen.queryByRole("button", { name: copy.retry })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("link", { name: copy.back }));
    expect(await screen.findByRole("heading", { name: "Courses" })).toBeInTheDocument();
  });

  it("TA-07 route inconnue → page introuvable avec retour", async () => {
    mockApi({});
    renderAt("/nimportequoi");
    expect(await screen.findAllByText(copy.pageNotFound)).not.toHaveLength(0);
    expect(screen.getByRole("link", { name: copy.back })).toHaveAttribute("href", "/");
  });

  it("TA-08 détail : erreur serveur → message d'erreur + Réessayer relance l'appel", async () => {
    let ok = false;
    const f = mockApi({ "/api/notes/1": () => (ok ? json(notes[0]) : json({}, 500)) });
    renderAt("/notes/1");
    expect(await screen.findByRole("alert")).toHaveTextContent(copy.error);
    ok = true;
    await userEvent.click(screen.getByRole("button", { name: copy.retry }));
    expect(await screen.findByRole("heading", { level: 1, name: "Bienvenue" })).toBeInTheDocument();
    expect(f).toHaveBeenCalledTimes(2);
  });

  it("TA-09 contenu vide → texte de substitution", async () => {
    mockApi({ "/api/notes/5": () => json({ id: 5, title: "Vide", content: "" }) });
    renderAt("/notes/5");
    expect(await screen.findByText(copy.emptyContent)).toBeInTheDocument();
  });
});

describe("US-05 états", () => {
  it("TA-10 chargement : indicateur explicite tant que la réponse n'est pas arrivée", async () => {
    let release!: () => void;
    mockApi({
      "/api/notes": () => new Promise<Response>((r) => (release = () => r(json(notes)))),
    });
    renderAt("/");
    expect(screen.getByText(copy.loading)).toBeInTheDocument();
    release();
    expect(await screen.findByText("Bienvenue")).toBeInTheDocument();
    expect(screen.queryByText(copy.loading)).not.toBeInTheDocument();
  });

  it("TA-11 liste vide → « aucune note », distinct de l'erreur", async () => {
    mockApi({ "/api/notes": () => json([]) });
    renderAt("/");
    expect(await screen.findByText(copy.empty)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText(copy.error)).not.toBeInTheDocument();
  });

  const failures: [string, () => Response | Promise<Response>][] = [
    ["HTTP 500", () => json({ error: "boom" }, 500)],
    ["réseau", () => Promise.reject(new TypeError("Failed to fetch"))],
    ["JSON invalide", () => new Response("<html>oops</html>", { status: 200 })],
    ["schéma non conforme", () => json([{ id: "x" }])],
    ["404 sur la liste", () => json({}, 404)],
  ];
  for (const [i, [label, h]] of failures.entries()) {
    it(`TA-12.${i + 1} erreur (${label}) → message compréhensible sans détail technique`, async () => {
      mockApi({ "/api/notes": h });
      const { container } = renderAt("/");
      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(copy.error);
      expect(container.textContent).not.toMatch(/HTTP|500|TypeError|Failed to fetch|schéma|JSON|zod|boom|<html>/i);
    });
  }

  it("TA-13 Réessayer relance la récupération et affiche la liste", async () => {
    let ok = false;
    const f = mockApi({ "/api/notes": () => (ok ? json(notes) : json({}, 503)) });
    renderAt("/");
    await screen.findByRole("alert");
    ok = true;
    await userEvent.click(screen.getByRole("button", { name: copy.retry }));
    expect(await screen.findByText("Bienvenue")).toBeInTheDocument();
    expect(f).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("TA-14 Réessayer puis nouvel échec → l'erreur reste affichée", async () => {
    mockApi({ "/api/notes": () => json({}, 500) });
    renderAt("/");
    await userEvent.click(await screen.findByRole("button", { name: copy.retry }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });

  it("TA-15 ErrorBoundary : une exception de rendu n'abat pas l'application", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const Boom = () => {
      throw new Error("kaboom");
    };
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(copy.error);
    expect(screen.queryByText(/kaboom/)).not.toBeInTheDocument();
  });
});
