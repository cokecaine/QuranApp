import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DoaItem } from "./index";

const BASE_URL = "https://equran.id/api/doa";

export default function CategoryDetailScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();

  const [allDoas, setAllDoas] = useState<DoaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Counter state (tasbih) keyed by doa id
  const [counts, setCounts] = useState<Record<number, number>>({});

  // Full detail modal
  const [selectedDoa, setSelectedDoa] = useState<DoaItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Fetch all doas then filter by group ──────────────────────────────────
  const fetchDoas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(BASE_URL);
      const json = await res.json();
      if (json.status !== "success") throw new Error("Gagal memuat doa");
      const filtered: DoaItem[] = (json.data as DoaItem[]).filter(
        (d) => d.grup === category
      );
      setAllDoas(filtered);
    } catch (err: any) {
      setError(err.message || "Gagal memuat doa");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchDoas();
  }, [fetchDoas]);

  // ── Open full detail (fetches tentang) ───────────────────────────────────
  const openDetail = useCallback(async (doa: DoaItem) => {
    setSelectedDoa(doa);
    if (!doa.tentang) {
      setDetailLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/${doa.id}`);
        const json = await res.json();
        if (json.status === "success" && json.data) {
          setSelectedDoa(json.data);
        }
      } catch (_) {
      } finally {
        setDetailLoading(false);
      }
    }
  }, []);

  // ── Tasbih counter ────────────────────────────────────────────────────────
  const handleCounterTap = async (id: number) => {
    const current = counts[id] || 0;
    const next = current + 1;
    setCounts((prev) => ({ ...prev, [id]: next }));
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
  };

  const handleReset = async (id: number) => {
    setCounts((prev) => ({ ...prev, [id]: 0 }));
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
  };

  // ── Filter list ───────────────────────────────────────────────────────────
  const filteredDoas = searchQuery.trim()
    ? allDoas.filter(
        (d) =>
          d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.idn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.tr.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allDoas;

  // ── Render item ───────────────────────────────────────────────────────────
  const renderItem = ({ item, index }: { item: DoaItem; index: number }) => {
    const count = counts[item.id] || 0;

    return (
      <Card style={styles.prayerCard}>
        {/* Header */}
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => openDetail(item)}
          activeOpacity={0.7}
        >
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <Text style={styles.prayerTitle}>{item.nama}</Text>
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        </TouchableOpacity>

        {/* Arabic */}
        <View style={styles.arabicContainer}>
          <Text style={styles.arabicText}>{item.ar}</Text>
        </View>

        {/* Latin */}
        <Text style={styles.sectionLabel}>Latin</Text>
        <Text style={styles.latinText}>{item.tr}</Text>

        {/* Translation */}
        <Text style={styles.sectionLabel}>Terjemahan</Text>
        <Text style={styles.translationText}>{item.idn}</Text>

        {/* Tasbih counter */}
        <View style={styles.counterWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.counterButton}
            onPress={() => handleCounterTap(item.id)}
          >
            <Ionicons name="finger-print-outline" size={18} color="#1B6A9C" style={{ marginRight: 8 }} />
            <Text style={styles.counterText}>{count}×</Text>
            <Text style={styles.counterHint}>  Ketuk untuk hitung</Text>
          </TouchableOpacity>

          {count > 0 && (
            <Button
              label="Reset"
              variant="outline"
              onPress={() => handleReset(item.id)}
              icon={<Ionicons name="refresh" size={16} color="#8E8E93" />}
              style={styles.resetButton}
              textStyle={styles.resetText}
            />
          )}
        </View>
      </Card>
    );
  };

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          title={category || "Kategori Doa"}
          onBackPress={() => router.back()}
          containerStyle={styles.header}
          titleStyle={styles.headerTitle}
        />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1B6A9C" />
          <Text style={styles.loadingText}>Memuat doa…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          title={category || "Kategori Doa"}
          onBackPress={() => router.back()}
          containerStyle={styles.header}
          titleStyle={styles.headerTitle}
        />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDoas}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        title={category || "Kategori Doa"}
        onBackPress={() => router.back()}
        rightComponent={
          <TouchableOpacity onPress={() => setShowSearch(true)} style={styles.headerButton}>
            <Ionicons name="search-outline" size={24} color="#1C1C1E" />
          </TouchableOpacity>
        }
        containerStyle={styles.header}
        titleStyle={styles.headerTitle}
        customContent={
          showSearch ? (
            <View style={styles.searchBarContainer}>
              <Ionicons name="search-outline" size={20} color="#8E8E93" style={styles.searchIconStyle} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari doa..."
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                clearButtonMode="while-editing"
              />
              <TouchableOpacity
                onPress={() => { setSearchQuery(""); setShowSearch(false); }}
                style={styles.closeSearchButton}
              >
                <Text style={styles.closeSearchText}>Batal</Text>
              </TouchableOpacity>
            </View>
          ) : undefined
        }
      />

      <FlatList
        data={filteredDoas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#C7C7CC" />
            <Text style={styles.emptyText}>Tidak ada doa yang ditemukan</Text>
          </View>
        }
      />

      {/* Full Detail Modal */}
      <Modal
        visible={selectedDoa !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedDoa(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalCategoryLabel} numberOfLines={1}>
                {selectedDoa?.grup}
              </Text>
              <TouchableOpacity onPress={() => setSelectedDoa(null)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color="#3A3A3C" />
              </TouchableOpacity>
            </View>

            {selectedDoa && (
              <ScrollView
                contentContainerStyle={styles.modalScroll}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.modalTitle}>{selectedDoa.nama}</Text>

                <View style={styles.arabicBox}>
                  <Text style={styles.modalArabic}>{selectedDoa.ar}</Text>
                </View>

                <Text style={styles.modalLabel}>Latin</Text>
                <Text style={styles.modalLatin}>{selectedDoa.tr}</Text>

                <Text style={styles.modalLabel}>Terjemahan</Text>
                <Text style={styles.modalTranslation}>{selectedDoa.idn}</Text>

                {detailLoading ? (
                  <ActivityIndicator size="small" color="#1B6A9C" style={{ marginTop: 20 }} />
                ) : selectedDoa.tentang ? (
                  <View style={styles.tentangBox}>
                    <View style={styles.tentangHeader}>
                      <Ionicons name="information-circle" size={18} color="#1B6A9C" />
                      <Text style={styles.tentangTitle}>Keterangan</Text>
                    </View>
                    <Text style={styles.tentangText}>{selectedDoa.tentang}</Text>
                  </View>
                ) : null}

                <View style={{ height: 20 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
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
    borderBottomColor: "#EBF0F6",
    height: 56,
  },
  headerButton: { padding: 4, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1C1C1E" },
  searchBarContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  searchIconStyle: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "#1C1C1E", paddingVertical: 4 },
  closeSearchButton: { paddingLeft: 12 },
  closeSearchText: { fontSize: 15, color: "#007AFF", fontWeight: "500" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  loadingText: { marginTop: 12, fontSize: 16, color: "#8E8E93" },
  errorText: { marginTop: 12, fontSize: 16, color: "#FF3B30", textAlign: "center", marginBottom: 20 },
  retryButton: { backgroundColor: "#1B6A9C", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  retryText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  listContent: { padding: 16, paddingBottom: 100 },
  prayerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EBF0F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E2EFFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  numberText: { fontSize: 13, fontWeight: "bold", color: "#1B6A9C" },
  prayerTitle: { fontSize: 15, fontWeight: "bold", color: "#1C1C1E", flex: 1 },
  arabicContainer: {
    backgroundColor: "#F8F9FB",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F2F5",
  },
  arabicText: { fontSize: 22, color: "#1C1C1E", textAlign: "right", lineHeight: 40, writingDirection: "rtl" },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1B6A9C",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 8,
  },
  latinText: { fontSize: 14, fontStyle: "italic", color: "#48484A", lineHeight: 22, marginBottom: 8 },
  translationText: { fontSize: 14, color: "#1C1C1E", lineHeight: 22 },
  counterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F2F4F7",
  },
  counterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FC",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#C5DDEF",
  },
  counterText: { fontSize: 18, fontWeight: "bold", color: "#1B6A9C" },
  counterHint: { fontSize: 12, color: "#8E8E93" },
  resetButton: { marginLeft: 10, paddingHorizontal: 12, height: 42, borderRadius: 10 },
  resetText: { fontSize: 13, color: "#8E8E93", fontWeight: "600" },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 80 },
  emptyText: { marginTop: 12, fontSize: 16, color: "#8E8E93", textAlign: "center" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0F6",
  },
  modalCategoryLabel: { fontSize: 12, fontWeight: "bold", color: "#8E8E93", textTransform: "uppercase", letterSpacing: 0.8, flex: 1, marginRight: 8 },
  modalCloseBtn: { padding: 4 },
  modalScroll: { paddingHorizontal: 20, paddingTop: 16 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1C1C1E", marginBottom: 16 },
  arabicBox: {
    backgroundColor: "#F8F9FB",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#F0F2F5",
  },
  modalArabic: { fontSize: 26, color: "#1C1C1E", textAlign: "right", lineHeight: 48, writingDirection: "rtl" },
  modalLabel: { fontSize: 12, fontWeight: "bold", color: "#1B6A9C", marginTop: 18, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  modalLatin: { fontSize: 14.5, fontStyle: "italic", color: "#48484A", lineHeight: 22 },
  modalTranslation: { fontSize: 14.5, color: "#1C1C1E", lineHeight: 22 },
  tentangBox: { backgroundColor: "#F4F9FC", borderRadius: 12, padding: 14, marginTop: 20, borderWidth: 1, borderColor: "#D2E7F4" },
  tentangHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  tentangTitle: { fontSize: 13, fontWeight: "bold", color: "#1B6A9C", marginLeft: 6 },
  tentangText: { fontSize: 13, color: "#3A3A3C", lineHeight: 20 },
});
