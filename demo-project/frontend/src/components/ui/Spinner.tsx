export function Spinner() {
  return (
    <span role="status" className="inline-flex items-center gap-3">
      <span
        aria-hidden="true"
        className="h-6 w-6 rounded-full border-2 border-hull-edge border-t-plasma motion-safe:animate-orbit"
      />
      <span className="sr-only">Chargement</span>
    </span>
  );
}
