import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AyahBookmark {
  surahId: number;
  surahName: string;        // Arabic name e.g. "الفاتحة"
  surahNameLatin: string;   // Latin name e.g. "Al-Fatihah"
  ayahNumber: number;
  arabicText: string;
  latinText: string;
  translationText: string;
  savedAt: number;          // Date.now()
}

// ─── Storage key ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "quran_bookmarks";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<AyahBookmark[]>([]);
  const [loaded, setLoaded] = useState(false);

  // ── Load from storage helper ────────────────────────────────────────────
  const refreshBookmarks = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: AyahBookmark[] = JSON.parse(raw);
        // Sort newest first
        parsed.sort((a, b) => b.savedAt - a.savedAt);
        setBookmarks(parsed);
      } else {
        setBookmarks([]);
      }
    } catch (_) {
    } finally {
      setLoaded(true);
    }
  }, []);

  // ── Initial load on mount ────────────────────────────────────────────────
  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  // ── Persist helper ────────────────────────────────────────────────────────
  const persist = useCallback(async (list: AyahBookmark[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (_) {}
  }, []);

  // ── Check if an ayah is bookmarked ────────────────────────────────────────
  const isBookmarked = useCallback(
    (surahId: number, ayahNumber: number): boolean => {
      return bookmarks.some(
        (b) => b.surahId === surahId && b.ayahNumber === ayahNumber
      );
    },
    [bookmarks]
  );

  // ── Add bookmark ──────────────────────────────────────────────────────────
  const addBookmark = useCallback(
    async (bookmark: Omit<AyahBookmark, "savedAt">) => {
      const entry: AyahBookmark = { ...bookmark, savedAt: Date.now() };
      const updated = [entry, ...bookmarks.filter(
        (b) => !(b.surahId === bookmark.surahId && b.ayahNumber === bookmark.ayahNumber)
      )];
      setBookmarks(updated);
      await persist(updated);
    },
    [bookmarks, persist]
  );

  // ── Remove bookmark ───────────────────────────────────────────────────────
  const removeBookmark = useCallback(
    async (surahId: number, ayahNumber: number) => {
      const updated = bookmarks.filter(
        (b) => !(b.surahId === surahId && b.ayahNumber === ayahNumber)
      );
      setBookmarks(updated);
      await persist(updated);
    },
    [bookmarks, persist]
  );

  // ── Toggle bookmark ───────────────────────────────────────────────────────
  const toggleBookmark = useCallback(
    async (bookmark: Omit<AyahBookmark, "savedAt">) => {
      if (isBookmarked(bookmark.surahId, bookmark.ayahNumber)) {
        await removeBookmark(bookmark.surahId, bookmark.ayahNumber);
      } else {
        await addBookmark(bookmark);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  // ── Clear all bookmarks ───────────────────────────────────────────────────
  const clearAllBookmarks = useCallback(async () => {
    setBookmarks([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, []);

  return {
    bookmarks,
    loaded,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearAllBookmarks,
    refreshBookmarks,
  };
}
