import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/ui/AppShell";
import { NoteDetailPage } from "./pages/NoteDetailPage";
import { NotesListPage } from "./pages/NotesListPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<NotesListPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
