import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { useBookmarks, AyahBookmark } from "@/hooks/use-bookmarks";

type TabType = "Semua" | "Al-Quran" | "EventMu" | "Berita";

const TABS: TabType[] = ["Semua", "Al-Quran", "EventMu", "Berita"];

export default function BookmarkScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("Semua");

  const { bookmarks, loaded, removeBookmark, clearAllBookmarks, refreshBookmarks } = useBookmarks();

  // Reload bookmarks every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshBookmarks();
    }, [refreshBookmarks])
  );

  // Format relative timestamp
  const formatDate = (ts: number): string => {
    const now = Date.now();
    const diff = now - ts;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
  };

  const confirmClearAll = () => {
    Alert.alert(
      "Hapus Semua Bookmark",
      "Apakah Anda yakin ingin menghapus semua bookmark Al-Quran?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: clearAllBookmarks,
        },
      ]
    );
  };

  const confirmRemove = (b: AyahBookmark) => {
    Alert.alert(
      "Hapus Bookmark",
      `Hapus bookmark ${b.surahNameLatin} ayat ${b.ayahNumber}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => removeBookmark(b.surahId, b.ayahNumber),
        },
      ]
    );
  };

  const renderBookmarkCard = ({ item }: { item: AyahBookmark }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/surah/${item.surahId}` as any)}
    >
      <Card style={styles.bookmarkCard}>
        {/* Surah + ayah badge row */}
        <View style={styles.bookmarkCardHeader}>
          <View style={styles.surahBadge}>
            <Text style={styles.surahBadgeText} numberOfLines={1}>
              {item.surahNameLatin}
            </Text>
            <Text style={styles.ayahBadgeText}> • Ayat {item.ayahNumber}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => confirmRemove(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="bookmark" size={20} color="#2F58E8" />
          </TouchableOpacity>
        </View>

        {/* Arabic snippet */}
        <Text style={styles.arabicSnippet} numberOfLines={2}>
          {item.arabicText}
        </Text>

        {/* Translation snippet */}
        <Text style={styles.translationSnippet} numberOfLines={2}>
          {item.translationText}
        </Text>

        {/* Timestamp */}
        <Text style={styles.timestamp}>{formatDate(item.savedAt)}</Text>
      </Card>
    </TouchableOpacity>
  );

  const showQuranSection = activeTab === "Semua" || activeTab === "Al-Quran";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header
        title="Bookmark"
        titleStyle={styles.headerTitle}
        containerStyle={styles.header}
        rightComponent={
          showQuranSection && bookmarks.length > 0 ? (
            <TouchableOpacity onPress={confirmClearAll} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Hapus Semua</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {/* Tabs */}
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Al-Quran Bookmarks */}
      {showQuranSection && (
        <View style={styles.flex}>
          {!loaded ? (
            <View style={styles.centered}>
              <Text style={styles.loadingText}>Memuat bookmark…</Text>
            </View>
          ) : bookmarks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="bookmark-outline" size={48} color="#A0AEC0" />
              </View>
              <Text style={styles.emptyTitle}>Belum Ada Bookmark</Text>
              <Text style={styles.emptySubtitle}>
                Simpan ayat favorit Anda dengan mengetuk ikon bookmark saat membaca Al-Quran.
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push("/quran" as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.exploreButtonText}>Buka Al-Quran</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={bookmarks}
              keyExtractor={(item) => `${item.surahId}-${item.ayahNumber}`}
              renderItem={renderBookmarkCard}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Al-Quran</Text>
                  <Text style={styles.sectionCount}>{bookmarks.length} ayat tersimpan</Text>
                </View>
              }
            />
          )}
        </View>
      )}

      {/* EventMu / Berita empty states */}
      {(activeTab === "EventMu" || activeTab === "Berita") && (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name={activeTab === "EventMu" ? "calendar-outline" : "newspaper-outline"}
              size={48}
              color="#A0AEC0"
            />
          </View>
          <Text style={styles.emptyTitle}>Belum Ada Bookmark</Text>
          <Text style={styles.emptySubtitle}>
            Simpan {activeTab === "EventMu" ? "event menarik" : "berita penting"} yang ingin Anda kunjungi kembali di sini.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FE",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  clearBtn: { padding: 4 },
  clearBtnText: { fontSize: 13, color: "#FF3B30", fontWeight: "600" },
  tabBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#F8F9FE",
  },
  tabBarScroll: { paddingHorizontal: 16 },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemActive: { borderBottomColor: "#2F58E8" },
  tabLabel: { fontSize: 15, fontWeight: "500", color: "#8E8E93" },
  tabLabelActive: { color: "#2F58E8", fontWeight: "700" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 15, color: "#8E8E93" },
  listContent: { padding: 16, paddingBottom: 110 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1C1C1E" },
  sectionCount: { fontSize: 13, color: "#8E8E93", fontWeight: "500" },
  bookmarkCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EBF0F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  bookmarkCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  surahBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexShrink: 1,
  },
  surahBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2F58E8",
  },
  ayahBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#5B80F5",
  },
  removeBtn: { padding: 2, marginLeft: 8 },
  arabicSnippet: {
    fontSize: 20,
    color: "#1A1A1A",
    textAlign: "right",
    lineHeight: 36,
    marginBottom: 8,
    writingDirection: "rtl",
  },
  translationSnippet: {
    fontSize: 13,
    color: "#48484A",
    lineHeight: 18,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 11,
    color: "#C7C7CC",
    textAlign: "right",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#2F58E8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});