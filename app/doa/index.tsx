import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  TextInput,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_URL = "https://equran.id/api/doa";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DoaItem {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang?: string;
  tag?: string[];
}

interface DoaGroup {
  grup: string;
  icon: string;
  items: DoaItem[];
}

// ─── Icon mapping ─────────────────────────────────────────────────────────────

const GROUP_ICONS: Record<string, string> = {
  "Doa Sebelum dan Sesudah Tidur": "moon-outline",
  "Doa Ketika Bangun Tidur": "sunny-outline",
  "Doa Masuk dan Keluar Kamar Mandi": "water-outline",
  "Doa Makan dan Minum": "restaurant-outline",
  "Doa Bepergian": "car-outline",
  "Doa Masuk dan Keluar Masjid": "business-outline",
  "Doa Pagi dan Petang": "partly-sunny-outline",
  "Doa Keselamatan": "shield-checkmark-outline",
  "Doa Memohon Ampun": "hand-left-outline",
  "Doa Kesehatan": "heart-outline",
  "Doa Belajar dan Ilmu": "book-outline",
  "Doa Rezeki": "cash-outline",
  "Doa Perlindungan": "umbrella-outline",
};

function getGroupIcon(grup: string): string {
  for (const key of Object.keys(GROUP_ICONS)) {
    if (grup.toLowerCase().includes(key.toLowerCase().split(" ").slice(-2).join(" ").toLowerCase())) {
      return GROUP_ICONS[key];
    }
  }
  // Try partial keyword matches
  if (grup.toLowerCase().includes("tidur")) return "moon-outline";
  if (grup.toLowerCase().includes("makan") || grup.toLowerCase().includes("minum")) return "restaurant-outline";
  if (grup.toLowerCase().includes("masjid")) return "business-outline";
  if (grup.toLowerCase().includes("pagi") || grup.toLowerCase().includes("petang")) return "partly-sunny-outline";
  if (grup.toLowerCase().includes("belajar") || grup.toLowerCase().includes("ilmu")) return "book-outline";
  if (grup.toLowerCase().includes("ampun") || grup.toLowerCase().includes("tobat")) return "hand-left-outline";
  if (grup.toLowerCase().includes("rezeki")) return "cash-outline";
  if (grup.toLowerCase().includes("perjalanan") || grup.toLowerCase().includes("bepergian")) return "car-outline";
  if (grup.toLowerCase().includes("kamar") || grup.toLowerCase().includes("mandi")) return "water-outline";
  if (grup.toLowerCase().includes("perlindungan")) return "umbrella-outline";
  if (grup.toLowerCase().includes("kesehatan") || grup.toLowerCase().includes("sakit")) return "heart-outline";
  return "hands-outline";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DoaScreen() {
  const router = useRouter();

  const [groups, setGroups] = useState<DoaGroup[]>([]);
  const [allDoas, setAllDoas] = useState<DoaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Detail modal
  const [selectedDoa, setSelectedDoa] = useState<DoaItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Fetch all doas on mount ───────────────────────────────────────────────
  const fetchAllDoas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(BASE_URL);
      const json = await res.json();
      if (json.status !== "success") throw new Error("Gagal memuat doa");

      const data: DoaItem[] = json.data;
      setAllDoas(data);

      // Group by 'grup'
      const groupMap: Record<string, DoaItem[]> = {};
      for (const doa of data) {
        if (!groupMap[doa.grup]) groupMap[doa.grup] = [];
        groupMap[doa.grup].push(doa);
      }

      setGroups(
        Object.entries(groupMap).map(([grup, items]) => ({
          grup,
          icon: getGroupIcon(grup),
          items,
        }))
      );
    } catch (err: any) {
      setError(err.message || "Gagal memuat doa");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllDoas();
  }, []);

  // ── Fetch detail ─────────────────────────────────────────────────────────
  const openDetail = useCallback(async (doa: DoaItem) => {
    setSelectedDoa(doa);
    // If tentang is not yet loaded, fetch the full detail
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

  // ── Search ────────────────────────────────────────────────────────────────
  const searchResults = searchQuery.trim()
    ? allDoas.filter(
        (d) =>
          d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.idn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.grup.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearch(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          title="Doa - doa"
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
          title="Doa - doa"
          onBackPress={() => router.back()}
          containerStyle={styles.header}
          titleStyle={styles.headerTitle}
        />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAllDoas}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header
        title="Doa - doa"
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
              <Ionicons name="search-outline" size={20} color="#8E8E93" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari doa..."
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                clearButtonMode="while-editing"
              />
              <TouchableOpacity onPress={clearSearch} style={styles.closeSearchButton}>
                <Text style={styles.closeSearchText}>Batal</Text>
              </TouchableOpacity>
            </View>
          ) : undefined
        }
      />

      {/* Search Results */}
      {showSearch && searchQuery.trim() !== "" ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.searchList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openDetail(item)}>
              <Card style={styles.searchResultCard}>
                <View style={styles.searchResultHeader}>
                  <Text style={styles.searchResultTitle}>{item.nama}</Text>
                  <Text style={styles.searchResultCategory}>{item.grup}</Text>
                </View>
                <Text style={styles.searchResultSnippet} numberOfLines={2}>
                  {item.idn}
                </Text>
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#C7C7CC" />
              <Text style={styles.emptyText}>Tidak ada doa yang cocok</Text>
            </View>
          }
        />
      ) : (
        // Category Grid
        <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
          {groups.map((group, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() =>
                router.push({
                  pathname: "/doa/[category]" as any,
                  params: { category: group.grup },
                })
              }
              activeOpacity={0.7}
            >
              <Card style={styles.gridCard}>
                <View style={styles.iconOutlineCircle}>
                  <Ionicons name={group.icon as any} size={24} color="#1B6A9C" />
                </View>
                <Text style={styles.cardLabel} numberOfLines={2}>
                  {group.grup}
                </Text>
                <Text style={styles.cardCount}>{group.items.length} doa</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Detail Modal */}
      <Modal
        visible={selectedDoa !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedDoa(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalCategoryTitle} numberOfLines={1}>
                {selectedDoa?.grup}
              </Text>
              <TouchableOpacity onPress={() => setSelectedDoa(null)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color="#3A3A3C" />
              </TouchableOpacity>
            </View>

            {selectedDoa && (
              <ScrollView
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.modalTitle}>{selectedDoa.nama}</Text>

                {/* Arabic */}
                <View style={styles.arabicBox}>
                  <Text style={styles.modalArabicText}>{selectedDoa.ar}</Text>
                </View>

                {/* Latin */}
                <Text style={styles.modalSectionLabel}>Latin</Text>
                <Text style={styles.modalLatinText}>{selectedDoa.tr}</Text>

                {/* Translation */}
                <Text style={styles.modalSectionLabel}>Terjemahan</Text>
                <Text style={styles.modalTranslationText}>{selectedDoa.idn}</Text>

                {/* Keterangan / tentang */}
                {detailLoading ? (
                  <ActivityIndicator size="small" color="#1B6A9C" style={{ marginTop: 20 }} />
                ) : selectedDoa.tentang ? (
                  <View style={styles.fadhilahBox}>
                    <View style={styles.fadhilahHeader}>
                      <Ionicons name="information-circle" size={18} color="#1B6A9C" />
                      <Text style={styles.fadhilahTitle}>Keterangan</Text>
                    </View>
                    <Text style={styles.fadhilahText}>{selectedDoa.tentang}</Text>
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
  headerButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    paddingVertical: 4,
  },
  closeSearchButton: {
    paddingLeft: 12,
  },
  closeSearchText: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "500",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8E8E93",
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#1B6A9C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    justifyContent: "space-between",
    paddingBottom: 100,
  },
  gridCard: {
    width: (SCREEN_WIDTH - 36) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EBF0F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  iconOutlineCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D2E1EF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F7FC",
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 12,
    lineHeight: 18,
  },
  cardCount: {
    fontSize: 11,
    color: "#1B6A9C",
    fontWeight: "500",
    marginTop: 4,
  },
  searchList: {
    padding: 16,
    paddingBottom: 100,
  },
  searchResultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EBF0F6",
  },
  searchResultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  searchResultTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1C1C1E",
    flex: 1,
  },
  searchResultCategory: {
    fontSize: 11,
    color: "#1B6A9C",
    fontWeight: "600",
    backgroundColor: "#E2EFFB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 1,
  },
  searchResultSnippet: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
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
  modalCategoryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    flex: 1,
    marginRight: 8,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  arabicBox: {
    backgroundColor: "#F8F9FB",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#F0F2F5",
  },
  modalArabicText: {
    fontSize: 26,
    color: "#1C1C1E",
    textAlign: "right",
    lineHeight: 48,
    writingDirection: "rtl",
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1B6A9C",
    marginTop: 18,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalLatinText: {
    fontSize: 14.5,
    fontStyle: "italic",
    color: "#48484A",
    lineHeight: 22,
  },
  modalTranslationText: {
    fontSize: 14.5,
    color: "#1C1C1E",
    lineHeight: 22,
  },
  fadhilahBox: {
    backgroundColor: "#F4F9FC",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#D2E7F4",
  },
  fadhilahHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  fadhilahTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1B6A9C",
    marginLeft: 6,
  },
  fadhilahText: {
    fontSize: 13,
    color: "#3A3A3C",
    lineHeight: 20,
  },
});
