import { copy } from "../copy";
import { Button } from "../components/ui/Button";
import { NoteCard } from "../components/ui/NoteCard";
import { StatusMessage } from "../components/ui/StatusMessage";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useNotes } from "../hooks/useNotes";

export function NotesListPage() {
  useDocumentTitle(`${copy.listTitle} — ${copy.appName}`);
  const { state, retry } = useNotes();

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-bold text-starlight">{copy.listTitle}</h1>
      {state.status === "loading" && <StatusMessage variant="loading" message={copy.loading} />}
      {(state.status === "error" || state.status === "notFound") && (
        <StatusMessage
          variant="error"
          message={copy.error}
          action={<Button onClick={retry}>{copy.retry}</Button>}
        />
      )}
      {state.status === "success" &&
        (state.data.length === 0 ? (
          <StatusMessage variant="empty" message={copy.empty} />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.data.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </ul>
        ))}
    </>
  );
}
