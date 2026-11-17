import { Link } from "react-router-dom";
import type { Note } from "../../api/schemas";

export function NoteCard({ note }: { note: Note }) {
  return (
    <li className="list-none">
      <Link
        to={`/notes/${note.id}`}
        className="block h-full rounded-xl border border-hull-edge bg-hull p-5 transition-shadow hover:border-nova hover:shadow-glow-nova motion-safe:animate-float-in"
      >
        <h2 className="break-words font-display text-lg text-plasma">{note.title}</h2>
        <p className="mt-2 line-clamp-3 whitespace-pre-line break-words text-stardust">
          {note.content}
        </p>
      </Link>
    </li>
  );
}
