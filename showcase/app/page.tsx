export default function Home() {
  return (
    <div className="page-wrapper">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="site-header">
        <h1>MASA — Quran &amp; Prayer App</h1>
        <p className="subtitle">
          A full-featured Muslim lifestyle mobile app built with Expo SDK 54 &amp; React Native.
          Prayer schedules, Qibla compass, Al-Quran, daily duas, Islamic calendar, and more.
        </p>
        <div className="header-actions">
          <a
            href="https://github.com/cokecaine/QuranApp"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <span className="material-symbols-rounded">code</span>
            View Source
          </a>
          <a
            href="https://expo.dev/@cokecaine/masa-clone-boluketan"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <span className="material-symbols-rounded">open_in_new</span>
            Expo Project
          </a>
        </div>
      </header>

      {/* ── Screenshots ────────────────────────────────── */}
      <section className="section" aria-labelledby="screenshots-heading">
        <h2 id="screenshots-heading">Screenshots</h2>
        <div className="screenshots-gallery">
          <img src="/homepage.png" alt="Home screen with prayer widget and countdown" />
          <img src="/waktu-sholat.png" alt="Prayer schedule with salat times" />
          <img src="/alquran.png" alt="Al-Quran surah list with search" />
          <img src="/alquran-surah.png" alt="Surah detail with Arabic text and translation" />
          <img src="/kiblar.png" alt="Qibla compass with real-time sensor" />
          <img src="/doa.png" alt="Daily duas category grid" />
          <img src="/doa-deep.png" alt="Doa detail with Arabic text and fadhilah" />
          <img src="/kalender.png" alt="Islamic calendar with Hijri dates" />
          <img src="/kalender-konvert.png" alt="Hijri-Gregorian date converter" />
          <img src="/bookmark.png" alt="Bookmarks and reading progress" />
          <img src="/menu setting.png" alt="User profile and settings" />
          <img src="/booting.png" alt="App splash and boot screen" />
          <img src="/login menu.png" alt="Login and authentication screen" />
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section className="section" aria-labelledby="features-heading">
        <h2 id="features-heading">Features</h2>
        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">mosque</span>
            </div>
            <h3>Prayer Schedule</h3>
            <p>Real-time countdown to the next salat with dynamic time calculations and GPS-based location detection.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">explore</span>
            </div>
            <h3>Qibla Compass</h3>
            <p>Magnetometer sensor tracking with interactive manual fallback for emulators. ±6° precision indicator.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">menu_book</span>
            </div>
            <h3>Al-Quran Digital</h3>
            <p>All 114 surahs with Arabic typography, Latin transliteration, and Indonesian translations per ayah.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">self_improvement</span>
            </div>
            <h3>Daily Duas</h3>
            <p>Categorized dua collection with Arabic text, transliteration, fadhilah, and reference sources.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">calendar_month</span>
            </div>
            <h3>Islamic Calendar</h3>
            <p>Dual-date monthly grid mapping Gregorian to Hijri dates with Islamic holiday indicators.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">swap_horiz</span>
            </div>
            <h3>Date Converter</h3>
            <p>Bidirectional Hijri–Gregorian converter using Julian Day algorithm for accurate date math.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">bookmark</span>
            </div>
            <h3>Bookmarks</h3>
            <p>Save and track reading progress across Al-Quran surahs with categorized bookmark management.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">lock</span>
            </div>
            <h3>
              Authentication
              <span className="badge-demo">Demo / dev only</span>
            </h3>
            <p>Clerk-powered email, password &amp; Google OAuth login. Automatic mock mode for local testing without API keys. Full Clerk authentication only works in development — production OAuth is not configured for public use.</p>
          </div>

        </div>
      </section>

      {/* ── Tech Stack ─────────────────────────────────── */}
      <section className="section" aria-labelledby="tech-heading">
        <h2 id="tech-heading">Tech Stack</h2>
        <ul className="tech-list">
          <li><span className="material-symbols-rounded">smartphone</span>Expo SDK 54</li>
          <li><span className="material-symbols-rounded">code</span>React Native</li>
          <li><span className="material-symbols-rounded">route</span>Expo Router</li>
          <li><span className="material-symbols-rounded">lock</span>Clerk Auth</li>
          <li><span className="material-symbols-rounded">explore</span>expo-sensors</li>
          <li><span className="material-symbols-rounded">location_on</span>expo-location</li>
          <li><span className="material-symbols-rounded">volume_up</span>expo-audio</li>
          <li><span className="material-symbols-rounded">storage</span>AsyncStorage</li>
          <li><span className="material-symbols-rounded">build</span>EAS Build</li>
        </ul>
      </section>

      {/* ── APIs ───────────────────────────────────────── */}
      <section className="section" aria-labelledby="apis-heading">
        <h2 id="apis-heading">External APIs</h2>
        <ul className="api-list">
          <li>
            <span className="material-symbols-rounded">api</span>
            <div>
              <strong>Al-Quran API</strong> —{" "}
              <a href="https://equran.id" target="_blank" rel="noopener noreferrer">equran.id</a>.
              {" "}Full 114 surah list and ayah-level detail with translations.
            </div>
          </li>
          <li>
            <span className="material-symbols-rounded">location_on</span>
            <div>
              <strong>Reverse Geocoding</strong> — expo-location converts GPS coordinates to city names for prayer time localisation.
            </div>
          </li>
          <li>
            <span className="material-symbols-rounded">sensors</span>
            <div>
              <strong>Magnetometer</strong> — expo-sensors reads the device magnetic field to compute real-time Qibla direction.
            </div>
          </li>
        </ul>
      </section>

      {/* ── Team ───────────────────────────────────────── */}
      <section className="section" aria-labelledby="team-heading">
        <h2 id="team-heading">Team — Boluketan</h2>
        <p style={{ fontSize: 15, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.6 }}>
          Developed at <strong style={{ color: "var(--text)" }}>Universitas Muhammadiyah Surakarta (UMS)</strong> for the Apple Academy Mobile Computing assignment.
        </p>
        <table className="team-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>NIM</th>
              <th>Contribution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Onic Agustino</td>
              <td className="nim">L200234275</td>
              <td>Homepage, Prayer Feature, Bookmark</td>
            </tr>
            <tr>
              <td>Mahardika Fatwa Ramadhan</td>
              <td className="nim">L200248067</td>
              <td>Quran, Surah Details, Documentation</td>
            </tr>
            <tr>
              <td>Guruh Widisaputra</td>
              <td className="nim">L200244058</td>
              <td>EAS Build, Project Configuration</td>
            </tr>
            <tr>
              <td>Affan Ilham Arsyila</td>
              <td className="nim">L200234024</td>
              <td>Authentication, Profile, Audio Playback, Bookmarks, Salat Hook, Documentation</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── Getting Started ────────────────────────────── */}
      <section className="section" aria-labelledby="setup-heading">
        <h2 id="setup-heading">Getting Started</h2>
        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">download</span>
            </div>
            <h3>1. Install</h3>
            <p>
              Clone the repo and run{" "}
              <span className="inline-code">npm install</span>{" "}
              in the root directory.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">tune</span>
            </div>
            <h3>2. Configure</h3>
            <p>
              Copy <span className="inline-code">.env.example</span> to{" "}
              <span className="inline-code">.env</span>. Clerk key is optional — app auto-activates mock mode.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-rounded">play_circle</span>
            </div>
            <h3>3. Run</h3>
            <p>
              Run <span className="inline-code">npm run start</span> then scan the QR code with Expo Go on your device.
            </p>
          </div>

        </div>
      </section>

      {/* ── Post-Submission Updates ──────────────────────── */}
      <section className="section" aria-labelledby="fixes-heading">
        <h2 id="fixes-heading">Post-Submission Updates</h2>
        <p className="fixes-intro">
          The submitted version has been updated to address several issues and complete unfinished
          functionality identified after submission. Updates by{" "}
          <a href="https://github.com/cokecaine" target="_blank" rel="noopener noreferrer">cokecaine</a>
          {" "}(Affan Ilham Arsyila, <span className="inline-code">L200234024</span>).
        </p>
        <table className="team-table fixes-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>State at submission</th>
              <th>Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="fixes-icon material-symbols-rounded">bookmark</span>
                Bookmarks
              </td>
              <td className="fixes-status fixes-broken">Broken — feature incomplete</td>
              <td>Fully implemented bookmark save/remove and reading progress tracking</td>
            </tr>
            <tr>
              <td>
                <span className="fixes-icon material-symbols-rounded">volume_up</span>
                Audio Playback
              </td>
              <td className="fixes-status fixes-broken">Broken — audio did not play</td>
              <td>Integrated expo-audio with proper playback controls and state management</td>
            </tr>
            <tr>
              <td>
                <span className="fixes-icon material-symbols-rounded">mosque</span>
                Salat Schedule
              </td>
              <td className="fixes-status fixes-broken">Hardcoded times — no API fetch</td>
              <td>Replaced static data with a live prayer-time calculation hook using device GPS coordinates</td>
            </tr>
            <tr>
              <td>
                <span className="fixes-icon material-symbols-rounded">location_on</span>
                GPS Location
              </td>
              <td className="fixes-status fixes-broken">Not working — always fallback city</td>
              <td>Fixed expo-location permission flow and reverse geocoding to correctly resolve the user&apos;s city</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="site-footer">
        <p>{new Date().getFullYear()} &copy; cokecaine</p>
      </footer>

    </div>
  );
}
