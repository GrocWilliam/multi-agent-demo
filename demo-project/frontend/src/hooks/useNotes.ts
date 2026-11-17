import { fetchNotes } from "../api/client";
import { useAsync } from "./useAsync";

export const useNotes = () => useAsync((signal) => fetchNotes(signal), []);
