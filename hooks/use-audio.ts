import { useState, useEffect } from "react";
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from "expo-audio";
import { Platform, ToastAndroid } from "react-native";

export function useAudio() {
  const [player, setPlayer] = useState<AudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize Audio mode on mount
  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
        });
      } catch (e) {
        console.warn("Failed to set audio mode", e);
      }
    })();
  }, []);

  async function playSound(url: string) {
    // If playing the same url, just toggle
    if (currentUrl === url && player) {
      if (player.playing) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
      return;
    }

    // Stop and unload previous sound if any
    if (player) {
      player.pause();
      player.remove();
      setPlayer(null);
    }

    try {
      setLoading(true);
      if (Platform.OS === "android") {
        ToastAndroid.show("Memuat audio...", ToastAndroid.SHORT);
      }

      const newPlayer = createAudioPlayer(url);
      
      // Listen to status updates to sync react state
      newPlayer.addListener("playbackStatusUpdate", (status) => {
        setIsPlaying(status.playing);
      });

      newPlayer.play();
      setPlayer(newPlayer);
      setCurrentUrl(url);
      setIsPlaying(true);
    } catch (e: any) {
      console.error("Failed to load sound", e);
      if (Platform.OS === "android") {
        ToastAndroid.show("Gagal memutar audio", ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false);
    }
  }

  async function stopSound() {
    if (player) {
      player.pause();
      setIsPlaying(false);
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (player) {
        player.pause();
        player.remove();
      }
    };
  }, [player]);

  return { playSound, stopSound, isPlaying, currentUrl, loading };
}
