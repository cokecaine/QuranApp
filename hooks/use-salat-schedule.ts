import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Alert } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DailySchedule {
  tanggal: number;
  tanggal_lengkap: string; // "YYYY-MM-DD"
  hari: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface MonthlyScheduleData {
  provinsi: string;
  kabkota: string;
  bulan: number;
  tahun: number;
  bulan_nama: string;
  jadwal: DailySchedule[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = "https://equran.id/api/v2/shalat";

const STORAGE_KEYS = {
  PROVINSI: "salat_provinsi",
  KABKOTA: "salat_kabkota",
};

const DEFAULT_PROVINSI = "Jawa Tengah";
const DEFAULT_KABKOTA = "Kab. Sukoharjo";

// ─── Fuzzy matching helpers ────────────────────────────────────────────────────

/**
 * Strips common Indonesian city/regency prefixes and normalizes the string.
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/\bkab\.\s*/g, "")
    .replace(/\bkabupaten\s*/g, "")
    .replace(/\bkota\s*/g, "")
    .replace(/\bprovinci\s*/g, "")
    .replace(/\bprovinsi\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Finds the best match from a list by normalized string comparison.
 * First tries exact match, then substring inclusion.
 */
function findBestMatch(query: string, list: string[]): string | null {
  if (!query) return null;
  const nq = normalize(query);

  // Exact normalized match
  const exact = list.find((item) => normalize(item) === nq);
  if (exact) return exact;

  // The query is contained in an item, or an item is contained in the query
  const partial = list.find(
    (item) => normalize(item).includes(nq) || nq.includes(normalize(item))
  );
  return partial ?? null;
}

// ─── API helpers ─────────────────────────────────────────────────────────────

async function fetchProvinces(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/provinsi`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message || "Gagal mengambil daftar provinsi");
  return json.data as string[];
}

async function fetchCities(provinsi: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/kabkota`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provinsi }),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message || "Gagal mengambil daftar kabupaten/kota");
  return json.data as string[];
}

async function fetchMonthlySchedule(
  provinsi: string,
  kabkota: string,
  bulan: number,
  tahun: number
): Promise<MonthlyScheduleData> {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provinsi, kabkota, bulan, tahun }),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message || "Gagal mengambil jadwal shalat");
  return json.data as MonthlyScheduleData;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSalatSchedule() {
  const now = new Date();

  // Selected location
  const [provinsi, setProvinsi] = useState<string>(DEFAULT_PROVINSI);
  const [kabkota, setKabkota] = useState<string>(DEFAULT_KABKOTA);

  // Province / city lists (for picker)
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // GPS
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string>("");

  // Monthly schedule
  const [scheduleData, setScheduleData] = useState<MonthlyScheduleData | null>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [errorSchedule, setErrorSchedule] = useState<string>("");

  // Current fetched month (to avoid redundant requests)
  const [fetchedMonth, setFetchedMonth] = useState<{
    bulan: number;
    tahun: number;
    provinsi: string;
    kabkota: string;
  } | null>(null);

  // ── Load saved location on mount ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [savedProvinsi, savedKabkota] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PROVINSI),
          AsyncStorage.getItem(STORAGE_KEYS.KABKOTA),
        ]);
        if (savedProvinsi) setProvinsi(savedProvinsi);
        if (savedKabkota) setKabkota(savedKabkota);
      } catch (_) {}
    })();
  }, []);

  // ── Save location whenever it changes ────────────────────────────────────
  const saveLocation = useCallback(async (newProvinsi: string, newKabkota: string) => {
    setProvinsi(newProvinsi);
    setKabkota(newKabkota);
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.PROVINSI, newProvinsi],
        [STORAGE_KEYS.KABKOTA, newKabkota],
      ]);
    } catch (_) {}
  }, []);

  // ── Fetch province list ───────────────────────────────────────────────────
  const loadProvinces = useCallback(async () => {
    if (provinces.length > 0) return; // already loaded
    setLoadingProvinces(true);
    try {
      const list = await fetchProvinces();
      setProvinces(list);
    } catch (_) {
    } finally {
      setLoadingProvinces(false);
    }
  }, [provinces.length]);

  // ── Fetch city list for a given province ─────────────────────────────────
  const loadCities = useCallback(async (targetProvinsi: string) => {
    setLoadingCities(true);
    setCities([]);
    try {
      const list = await fetchCities(targetProvinsi);
      setCities(list);
    } catch (_) {
    } finally {
      setLoadingCities(false);
    }
  }, []);

  // ── GPS: detect location and auto-select province + city ─────────────────
  const detectGPSLocation = useCallback(async (): Promise<boolean> => {
    setGpsLoading(true);
    setGpsError("");
    try {
      // 1. Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan.");
      }

      // 2. Get coordinates
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 3. Reverse geocode
      const results = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (!results || results.length === 0) {
        throw new Error("Gagal mendapatkan nama lokasi dari GPS.");
      }

      const geocode = results[0];
      // Expo reverse geocode fields: region = province, subregion = city/regency
      const regionRaw = geocode.region ?? "";
      const subregionRaw = geocode.subregion ?? geocode.city ?? geocode.district ?? "";

      // 4. Fetch province list (reuse cached if available)
      let provinceList = provinces;
      if (provinceList.length === 0) {
        provinceList = await fetchProvinces();
        setProvinces(provinceList);
      }

      // 5. Match province
      const matchedProvinsi = findBestMatch(regionRaw, provinceList);
      if (!matchedProvinsi) {
        throw new Error(
          `Provinsi "${regionRaw}" tidak ditemukan dalam data API.\nCoba pilih lokasi secara manual.`
        );
      }

      // 6. Fetch cities for matched province
      const cityList = await fetchCities(matchedProvinsi);

      // 7. Match city
      const matchedKabkota = findBestMatch(subregionRaw, cityList);
      if (!matchedKabkota) {
        throw new Error(
          `Kota "${subregionRaw}" tidak ditemukan di ${matchedProvinsi}.\nCoba pilih lokasi secara manual.`
        );
      }

      // 8. Save matched location
      await saveLocation(matchedProvinsi, matchedKabkota);
      return true;
    } catch (err: any) {
      const message = err.message || "Gagal mendeteksi lokasi GPS.";
      setGpsError(message);
      Alert.alert("GPS Gagal", message);
      return false;
    } finally {
      setGpsLoading(false);
    }
  }, [provinces, saveLocation]);

  // ── Fetch monthly schedule ────────────────────────────────────────────────
  const loadSchedule = useCallback(
    async (bulan: number, tahun: number, overrideProvinsi?: string, overrideKabkota?: string) => {
      const targetProvinsi = overrideProvinsi ?? provinsi;
      const targetKabkota = overrideKabkota ?? kabkota;

      // Skip if already fetched same combo
      if (
        fetchedMonth &&
        fetchedMonth.bulan === bulan &&
        fetchedMonth.tahun === tahun &&
        fetchedMonth.provinsi === targetProvinsi &&
        fetchedMonth.kabkota === targetKabkota
      ) {
        return;
      }

      setLoadingSchedule(true);
      setErrorSchedule("");
      try {
        const data = await fetchMonthlySchedule(targetProvinsi, targetKabkota, bulan, tahun);
        setScheduleData(data);
        setFetchedMonth({ bulan, tahun, provinsi: targetProvinsi, kabkota: targetKabkota });
      } catch (err: any) {
        setErrorSchedule(err.message || "Gagal mengambil jadwal shalat");
      } finally {
        setLoadingSchedule(false);
      }
    },
    [provinsi, kabkota, fetchedMonth]
  );

  // ── Get schedule for a specific date ─────────────────────────────────────
  const getScheduleForDate = useCallback(
    (date: Date): DailySchedule | null => {
      if (!scheduleData) return null;
      const tanggal = date.getDate();
      const bulan = date.getMonth() + 1;
      const tahun = date.getFullYear();
      if (scheduleData.bulan !== bulan || scheduleData.tahun !== tahun) return null;
      return scheduleData.jadwal.find((d) => d.tanggal === tanggal) ?? null;
    },
    [scheduleData]
  );

  // ── Auto-load schedule for current month on location change ──────────────
  useEffect(() => {
    loadSchedule(now.getMonth() + 1, now.getFullYear(), provinsi, kabkota);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinsi, kabkota]);

  return {
    // Location state
    provinsi,
    kabkota,
    saveLocation,

    // GPS
    detectGPSLocation,
    gpsLoading,
    gpsError,

    // Province / city pickers
    provinces,
    cities,
    loadProvinces,
    loadCities,
    loadingProvinces,
    loadingCities,

    // Schedule
    scheduleData,
    loadSchedule,
    getScheduleForDate,
    loadingSchedule,
    errorSchedule,
  };
}
