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
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSalatSchedule, DailySchedule } from "@/hooks/use-salat-schedule";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Prayer display config ────────────────────────────────────────────────────

interface PrayerDisplayItem {
  key: keyof DailySchedule;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const PRAYER_ITEMS: PrayerDisplayItem[] = [
  { key: "imsak",   name: "Imsak",   icon: "cloudy-night" },
  { key: "subuh",   name: "Subuh",   icon: "cloudy-night" },
  { key: "terbit",  name: "Terbit",  icon: "sunny-outline" },
  { key: "dhuha",   name: "Dhuha",   icon: "sunny-outline" },
  { key: "dzuhur",  name: "Dzuhur",  icon: "sunny" },
  { key: "ashar",   name: "Ashar",   icon: "partly-sunny" },
  { key: "maghrib", name: "Maghrib", icon: "sunny-outline" },
  { key: "isya",    name: "Isya",    icon: "moon" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function getFormattedDate(date: Date) {
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function getHijriDate(date: Date) {
  const baseDate = new Date(2026, 5, 3); // 3 June 2026 = 17 Zulhijah 1447
  const diffDays = Math.round((date.getTime() - baseDate.getTime()) / 86400000);
  let hijriDay = 17 + diffDays;
  let hijriMonth = "Zulhijah";
  let hijriYear = 1447;
  if (hijriDay > 30) {
    hijriDay -= 30;
    hijriMonth = "Muharam";
    hijriYear = 1448;
  } else if (hijriDay <= 0) {
    hijriDay = 29 + hijriDay;
    hijriMonth = "Zulkaidah";
  }
  return `${hijriDay} ${hijriMonth} ${hijriYear} H`;
}

function isPrayerPassed(timeStr: string, selectedDate: Date): boolean {
  const today = new Date();
  const sameDay =
    selectedDate.getDate() === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();
  if (!sameDay) return selectedDate.getTime() < today.getTime();
  const now = new Date();
  const currentSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const [h, m] = timeStr.split(":").map(Number);
  return currentSec >= h * 3600 + m * 60;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SalatScreen() {
  const router = useRouter();
  const {
    provinsi,
    kabkota,
    saveLocation,
    provinces,
    cities,
    loadProvinces,
    loadCities,
    loadingProvinces,
    loadingCities,
    detectGPSLocation,
    gpsLoading,
    scheduleData,
    loadSchedule,
    getScheduleForDate,
    loadingSchedule,
    errorSchedule,
  } = useSalatSchedule();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [timeLeft, setTimeLeft] = useState("--:--:--");
  const [nextPrayer, setNextPrayer] = useState("");

  // Location picker modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pickerStep, setPickerStep] = useState<"province" | "city">("province");
  const [tempProvinsi, setTempProvinsi] = useState(provinsi);

  // Current day's schedule derived from scheduleData
  const todaySchedule = getScheduleForDate(selectedDate);

  // Prayers array for countdown + list rendering
  const prayers = todaySchedule
    ? PRAYER_ITEMS.map((p) => ({
        name: p.name,
        time: todaySchedule[p.key] as string,
        icon: p.icon,
      }))
    : [];

  // ── Load month on date change ─────────────────────────────────────────────
  useEffect(() => {
    loadSchedule(selectedDate.getMonth() + 1, selectedDate.getFullYear());
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);

  // ── Countdown Timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (prayers.length === 0) return;

    const updateCountdown = () => {
      const now = new Date();
      const currentSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      let next = prayers[0];
      let nextSec = 0;
      let found = false;

      for (const p of prayers) {
        const [h, m] = p.time.split(":").map(Number);
        const pSec = h * 3600 + m * 60;
        if (pSec > currentSec) {
          next = p;
          nextSec = pSec;
          found = true;
          break;
        }
      }

      if (!found) {
        const [h, m] = prayers[0].time.split(":").map(Number);
        nextSec = (h + 24) * 3600 + m * 60;
        next = prayers[0];
      }

      const diff = nextSec - currentSec;
      const hh = Math.floor(diff / 3600);
      const mm = Math.floor((diff % 3600) / 60);
      const ss = diff % 60;
      setTimeLeft(
        [hh, mm, ss].map((v) => v.toString().padStart(2, "0")).join(":")
      );
      setNextPrayer(next.name);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayers]);

  // ── Date Navigation ───────────────────────────────────────────────────────
  const changeDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  // ── Location picker ───────────────────────────────────────────────────────
  const openLocationPicker = useCallback(async () => {
    setTempProvinsi(provinsi);
    setPickerStep("province");
    setShowLocationModal(true);
    await loadProvinces();
  }, [provinsi, loadProvinces]);

  const selectProvinsi = useCallback(
    async (p: string) => {
      setTempProvinsi(p);
      setPickerStep("city");
      await loadCities(p);
    },
    [loadCities]
  );

  const selectKabkota = useCallback(
    async (kk: string) => {
      await saveLocation(tempProvinsi, kk);
      setShowLocationModal(false);
    },
    [tempProvinsi, saveLocation]
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0E1A39", "#0B0F1C"]} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <Header
        title="Waktu Salat"
        theme="dark"
        onBackPress={() => router.back()}
        titleStyle={styles.headerTitle}
        containerStyle={styles.header}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Location & Kiblat Row */}
        <View style={styles.infoRow}>
          <TouchableOpacity style={styles.locationButton} activeOpacity={0.8} onPress={openLocationPicker}>
            <Ionicons name="location-outline" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.locationText} numberOfLines={1}>{kabkota}</Text>
            <Ionicons name="chevron-forward" size={14} color="#FFFFFF" style={styles.locationIcon} />
          </TouchableOpacity>

          <Button
            label="Kiblat"
            onPress={() => router.push("/kiblat")}
            icon={<Ionicons name="compass-outline" size={16} color="#FFFFFF" />}
            style={styles.kiblatButton}
            textStyle={styles.kiblatButtonText}
          />
        </View>

        {/* Hero — Moon + countdown */}
        <View style={styles.heroSection}>
          <View style={styles.moonGlow}>
            <Ionicons name="moon" size={72} color="#E2E8F0" style={styles.moonIcon} />
          </View>
          {loadingSchedule ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.timerText}>{timeLeft}</Text>
              <Text style={styles.timerLabel}>
                {nextPrayer ? `Waktu tersisa sebelum salat ${nextPrayer}` : "Memuat jadwal…"}
              </Text>
            </>
          )}
        </View>

        {/* Prayer Card */}
        <Card variant="elevated" style={styles.prayerCard}>
          {/* Date Selector */}
          <View style={styles.dateSelectorRow}>
            <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateNavButton}>
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateText}>{getFormattedDate(selectedDate)}</Text>
              <Text style={styles.hijriText}>({getHijriDate(selectedDate)})</Text>
            </View>
            <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateNavButton}>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Prayer List */}
          <View style={styles.prayerListContainer}>
            {loadingSchedule ? (
              <View style={styles.centered}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.loadingText}>Mengambil jadwal…</Text>
              </View>
            ) : errorSchedule ? (
              <View style={styles.centered}>
                <Ionicons name="alert-circle-outline" size={36} color="#FF6B6B" />
                <Text style={styles.errorText}>{errorSchedule}</Text>
                <TouchableOpacity
                  onPress={() => loadSchedule(selectedDate.getMonth() + 1, selectedDate.getFullYear())}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryText}>Coba Lagi</Text>
                </TouchableOpacity>
              </View>
            ) : !todaySchedule ? (
              <View style={styles.centered}>
                <Text style={styles.loadingText}>Data tidak tersedia</Text>
              </View>
            ) : (
              prayers.map((item, idx) => {
                const passed = isPrayerPassed(item.time, selectedDate);
                const isActive = item.name === nextPrayer;
                return (
                  <View key={idx} style={[styles.prayerRow, isActive && styles.prayerRowActive]}>
                    <View style={styles.prayerLeftContainer}>
                      <Ionicons
                        name={passed ? "checkmark-circle" : "ellipse-outline"}
                        size={24}
                        color={passed ? "#34C759" : "rgba(255,255,255,0.2)"}
                        style={styles.checkmarkIcon}
                      />
                      <View style={styles.prayerInfoContainer}>
                        <Text style={styles.prayerName}>{item.name}</Text>
                        <Text style={styles.prayerTime}>{item.time}</Text>
                      </View>
                    </View>
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={isActive ? "#FFD60A" : "rgba(255,255,255,0.7)"}
                      style={styles.prayerIcon}
                    />
                  </View>
                );
              })
            )}
          </View>
        </Card>
      </ScrollView>

      {/* ── Location Picker Modal ── */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            {/* Header row */}
            <View style={styles.modalHeader}>
              {pickerStep === "city" && (
                <TouchableOpacity onPress={() => setPickerStep("province")} style={styles.backBtn}>
                  <Ionicons name="chevron-back" size={22} color="#0E1A39" />
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>
                  {pickerStep === "province" ? "Pilih Provinsi" : "Pilih Kabupaten / Kota"}
                </Text>
                {pickerStep === "city" && (
                  <Text style={styles.modalSubtitle}>{tempProvinsi}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => setShowLocationModal(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {/* GPS Button — only shown on province step */}
            {pickerStep === "province" && (
              <TouchableOpacity
                style={[styles.gpsButton, gpsLoading && styles.gpsButtonLoading]}
                onPress={async () => {
                  const success = await detectGPSLocation();
                  if (success) setShowLocationModal(false);
                }}
                disabled={gpsLoading}
                activeOpacity={0.8}
              >
                {gpsLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="location" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.gpsButtonText}>Deteksi Lokasi Otomatis (GPS)</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {/* List */}
            {pickerStep === "province" ? (
              loadingProvinces ? (
                <View style={styles.pickerLoading}>
                  <ActivityIndicator size="large" color="#2F58E8" />
                  <Text style={styles.loadingText}>Memuat provinsi…</Text>
                </View>
              ) : (
                <FlatList
                  data={provinces}
                  keyExtractor={(item) => item}
                  style={styles.pickerList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const isSelected = item === provinsi;
                    return (
                      <TouchableOpacity
                        style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                        onPress={() => selectProvinsi(item)}
                        activeOpacity={0.6}
                      >
                        <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                          {item}
                        </Text>
                        {isSelected && <Ionicons name="checkmark" size={18} color="#2F58E8" />}
                      </TouchableOpacity>
                    );
                  }}
                />
              )
            ) : loadingCities ? (
              <View style={styles.pickerLoading}>
                <ActivityIndicator size="large" color="#2F58E8" />
                <Text style={styles.loadingText}>Memuat kota…</Text>
              </View>
            ) : (
              <FlatList
                data={cities}
                keyExtractor={(item) => item}
                style={styles.pickerList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = item === kabkota && tempProvinsi === provinsi;
                  return (
                    <TouchableOpacity
                      style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                      onPress={() => selectKabkota(item)}
                      activeOpacity={0.6}
                    >
                      <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                        {item}
                      </Text>
                      {isSelected && <Ionicons name="checkmark" size={18} color="#2F58E8" />}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F1C",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 16,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    maxWidth: "60%",
  },
  locationText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  locationIcon: {
    marginLeft: 6,
  },
  kiblatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  kiblatButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  heroSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  moonIcon: {
    textShadowColor: "rgba(226, 232, 240, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  moonGlow: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  timerText: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  timerLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  prayerCard: {
    backgroundColor: "#131C38",
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  dateSelectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    paddingBottom: 16,
    marginBottom: 8,
  },
  dateNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  dateTextContainer: {
    alignItems: "center",
    flex: 1,
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  hijriText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  prayerListContainer: {
    marginTop: 8,
  },
  centered: {
    alignItems: "center",
    paddingVertical: 24,
  },
  loadingText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  retryButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  prayerRowActive: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  prayerLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkmarkIcon: {
    marginRight: 14,
  },
  prayerInfoContainer: {
    justifyContent: "center",
  },
  prayerName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  prayerTime: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 13,
    marginTop: 2,
    fontWeight: "600",
  },
  prayerIcon: {
    marginRight: 4,
  },

  // ─── Modal ──────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "78%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E5EA",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  closeBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0E153A",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  pickerLoading: {
    alignItems: "center",
    paddingVertical: 40,
  },
  pickerList: {
    maxHeight: 440,
  },
  pickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  pickerItemActive: {
    borderBottomColor: "#E5EDFF",
  },
  pickerItemText: {
    fontSize: 15,
    color: "#1C1C1E",
    fontWeight: "500",
    flex: 1,
  },
  pickerItemTextActive: {
    color: "#2F58E8",
    fontWeight: "bold",
  },
  gpsButton: {
    flexDirection: "row",
    backgroundColor: "#2F58E8",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#2F58E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  gpsButtonLoading: {
    backgroundColor: "#7D9DFF",
  },
  gpsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
