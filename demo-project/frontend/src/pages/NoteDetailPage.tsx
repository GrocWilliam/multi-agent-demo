import { useParams } from "react-router-dom";
import { copy } from "../copy";
import { Button, LinkButton } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { StatusMessage } from "../components/ui/StatusMessage";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useNote } from "../hooks/useNote";

export function NoteDetailPage() {
  const { id = "" } = useParams();
  const { state, retry } = useNote(id);
  const title =
    state.status === "success"
      ? state.data.title
      : state.status === "notFound"
        ? copy.notFound
        : copy.appName;
  useDocumentTitle(`${title} — ${copy.appName}`);

  const back = <LinkButton to="/">{copy.back}</LinkButton>;

  if (state.status === "loading") {
    return (
      <>
        <h1 className="sr-only">{copy.loading}</h1>
        <StatusMessage variant="loading" message={copy.loading} />
      </>
    );
  }
  if (state.status === "notFound") {
    return (
      <>
        <h1 className="sr-only">{copy.notFound}</h1>
        <StatusMessage variant="notFound" message={copy.notFound} action={back} />
      </>
    );
  }
  if (state.status === "error") {
    return (
      <>
        <h1 className="sr-only">{copy.error}</h1>
        <StatusMessage
          variant="error"
          message={copy.error}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={retry}>{copy.retry}</Button>
              {back}
            </div>
          }
        />
      </>
    );
  }
  return (
    <article>
      <div className="mb-6">{back}</div>
      <Card>
        <h1 className="break-words font-display text-2xl font-bold text-plasma">
          {state.data.title}
        </h1>
        <p className="mt-4 whitespace-pre-wrap break-words text-starlight">
          {state.data.content || copy.emptyContent}
        </p>
      </Card>
    </article>
  );
}
