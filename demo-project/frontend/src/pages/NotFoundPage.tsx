import { copy } from "../copy";
import { LinkButton } from "../components/ui/Button";
import { StatusMessage } from "../components/ui/StatusMessage";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle(`${copy.pageNotFound} — ${copy.appName}`);
  return (
    <>
      <h1 className="sr-only">{copy.pageNotFound}</h1>
      <StatusMessage
        variant="notFound"
        message={copy.pageNotFound}
        action={<LinkButton to="/">{copy.back}</LinkButton>}
      />
    </>
  );
}
