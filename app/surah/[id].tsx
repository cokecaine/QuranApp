import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
  ToastAndroid,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useBookmarks, AyahBookmark } from "@/hooks/use-bookmarks";
import { useAudio } from "@/hooks/use-audio";

interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  ayat: Ayah[];
}

// Quick toast helper (Android-native; falls back to Alert on iOS)
function showToast(message: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}

export default function SurahDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { playSound, isPlaying, currentUrl, loading: audioLoading } = useAudio();

  const fetchSurahDetail = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://equran.id/api/v2/surat/${id}`);
      if (!response.ok) throw new Error("Gagal mengambil detail surah");
      const json = await response.json();
      if (json.code === 200) {
        setSurah(json.data);
      } else {
        throw new Error(json.message || "Gagal memuat data");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchSurahDetail();
  }, [id]);

  const handleBookmark = useCallback(
    async (ayah: Ayah) => {
      if (!surah) return;
      const payload: Omit<AyahBookmark, "savedAt"> = {
        surahId: surah.nomor,
        surahName: surah.nama,
        surahNameLatin: surah.namaLatin,
        ayahNumber: ayah.nomorAyat,
        arabicText: ayah.teksArab,
        latinText: ayah.teksLatin,
        translationText: ayah.teksIndonesia,
      };

      const wasBookmarked = isBookmarked(surah.nomor, ayah.nomorAyat);
      await toggleBookmark(payload);

      const msg = wasBookmarked
        ? `Ayat ${ayah.nomorAyat} dihapus dari bookmark`
        : `Ayat ${ayah.nomorAyat} ditambahkan ke bookmark`;

      showToast(msg);
    },
    [surah, isBookmarked, toggleBookmark]
  );

  const renderVerse = ({ item }: { item: Ayah }) => {
    const bookmarked = surah ? isBookmarked(surah.nomor, item.nomorAyat) : false;

    return (
      <View style={styles.verseCard}>
        <View style={styles.verseHeader}>
          <View style={styles.verseNumberBadge}>
            <Text style={styles.verseNumberText}>{item.nomorAyat}</Text>
          </View>
          <View style={styles.verseActions}>
            {item.audio && item.audio["05"] && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => playSound(item.audio["05"])}
                activeOpacity={0.7}
              >
                {audioLoading && currentUrl === item.audio["05"] ? (
                  <ActivityIndicator size="small" color="#2F58E8" />
                ) : (
                  <Ionicons
                    name={isPlaying && currentUrl === item.audio["05"] ? "pause-circle" : "play-circle"}
                    size={24}
                    color="#2F58E8"
                  />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleBookmark(item)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color={bookmarked ? "#2F58E8" : "#2F58E8"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={20} color="#2F58E8" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.arabicText}>{item.teksArab}</Text>
        <Text style={styles.latinText}>{item.teksLatin}</Text>
        <Text style={styles.translationText}>{item.teksIndonesia}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2F58E8" />
        <Text style={styles.loadingText}>Memuat Surah…</Text>
      </View>
    );
  }

  if (error || !surah) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
        <Text style={styles.errorText}>{error || "Surah tidak ditemukan"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSurahDetail}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{surah.namaLatin}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <FlatList
        data={surah.ayat}
        keyExtractor={(item) => item.nomorAyat.toString()}
        renderItem={renderVerse}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.surahInfoCard}>
            <Text style={styles.surahArabicName}>{surah.nama}</Text>
            <Text style={styles.surahTranslation}>{surah.arti}</Text>
            <View style={styles.divider} />
            <Text style={styles.surahMeta}>
              {surah.tempatTurun.toUpperCase()} • {surah.jumlahAyat} AYAT
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FE",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  headerRightPlaceholder: { width: 32 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FE",
    padding: 24,
  },
  loadingText: { marginTop: 12, fontSize: 16, color: "#666666" },
  errorText: { marginTop: 12, fontSize: 16, color: "#FF3B30", textAlign: "center", marginBottom: 20 },
  retryButton: { backgroundColor: "#2F58E8", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  listContainer: { padding: 16 },
  surahInfoCard: {
    backgroundColor: "#2F58E8",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#2F58E8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  surahArabicName: { fontSize: 32, fontWeight: "bold", color: "#FFFFFF", marginBottom: 8 },
  surahTranslation: { fontSize: 16, color: "#E2E8F0", fontWeight: "500", marginBottom: 16 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.2)", width: "80%", marginBottom: 16 },
  surahMeta: { fontSize: 12, fontWeight: "bold", color: "#FFFFFF", letterSpacing: 1 },
  verseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  verseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#F8F9FE",
    padding: 8,
    borderRadius: 8,
  },
  verseNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2F58E8",
    justifyContent: "center",
    alignItems: "center",
  },
  verseNumberText: { color: "#FFFFFF", fontSize: 12, fontWeight: "bold" },
  verseActions: { flexDirection: "row" },
  actionButton: { marginLeft: 16, padding: 4 },
  arabicText: {
    fontSize: 26,
    fontWeight: "normal",
    color: "#1A1A1A",
    textAlign: "right",
    lineHeight: 48,
    marginBottom: 12,
    writingDirection: "rtl",
  },
  latinText: { fontSize: 14, fontStyle: "italic", color: "#666666", lineHeight: 20, marginBottom: 8 },
  translationText: { fontSize: 14, color: "#1A1A1A", lineHeight: 20 },
});
