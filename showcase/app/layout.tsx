import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MASA — Quran & Prayer App",
  description:
    "A full-featured Muslim lifestyle mobile app built with Expo & React Native. Features prayer schedules, Qibla compass, digital Al-Quran, daily duas, Islamic calendar, and user authentication.",
  icons: {
    icon: "/icon-app.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for speed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Inter — body text */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* Material Symbols Rounded — icon font with FILL axis */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
