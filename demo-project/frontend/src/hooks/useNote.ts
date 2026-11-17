import { fetchNote } from "../api/client";
import { useAsync } from "./useAsync";

export const useNote = (id: string) => useAsync((signal) => fetchNote(id, signal), [id]);
