export default function Home() {
  return (
    <div className="page-wrapper">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="site-header">
        <h1>MASA — Quran &amp; Prayer App</h1>
        <p className="subtitle">
          A Muslim lifestyle mobile app built with Expo SDK 54 &amp; React Native by a 4-person
          team at Universitas Muhammadiyah Surakarta (UMS).
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
            href="https://github.com/cokecaine/QuranApp/releases/download/v1.0.0/masa-quran-demo.apk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <span className="material-symbols-rounded">open_in_new</span>
            Download Apk
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

      {/* ── 1. Project Goal ────────────────────────────── */}
      <section className="section" aria-labelledby="goal-heading">
        <h2 id="goal-heading">Project Goal</h2>
        <p style={{ fontSize: 15, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 20 }}>
          This project is a functional clone of the{" "}
          <strong style={{ color: "var(--text)" }}>MASA App</strong> (Muslim Lifestyle Application
          by Muhammadiyah Software Labs), built as an assignment for the Mobile
          Computing course at UMS. The goal was to replicate its core Islamic utility features —
          prayer schedules, Al-Quran, Qibla compass, duas, and Islamic calendar — while applying
          professional development practices: feature-branch workflow, pull request reviews, and
          EAS cloud builds.
        </p>
        <ul className="goal-list">
          <li>
            <span className="material-symbols-rounded">check_circle</span>
            Replicate the MASA App&apos;s core features using Expo SDK 54 &amp; React Native
          </li>
          <li>
            <span className="material-symbols-rounded">check_circle</span>
            Collaborative development via feature branches, pull requests, and peer code reviews
          </li>
          <li>
            <span className="material-symbols-rounded">check_circle</span>
            Integrate real APIs: Al-Quran data, GPS-based location, and Magnetometer sensor
          </li>
          <li>
            <span className="material-symbols-rounded">check_circle</span>
            Distribute via EAS Build — standalone APK runnable without Expo Go
          </li>
        </ul>
      </section>

      {/* ── 2. Features ────────────────────────────────── */}
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

      {/* ── 3. Technology ──────────────────────────────── */}
      <section className="section" aria-labelledby="tech-heading">
        <h2 id="tech-heading">Technology</h2>

        <p style={{ fontSize: 15, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.6 }}>
          Libraries, frameworks, and external services used across the project.
        </p>

        <ul className="tech-list" style={{ marginBottom: 28 }}>
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

      {/* ── 4. Architecture ────────────────────────────── */}
      <section className="section" aria-labelledby="arch-heading">
        <h2 id="arch-heading">Architecture</h2>
        <p style={{ fontSize: 15, color: "var(--text-dim)", marginBottom: 24, lineHeight: 1.7 }}>
          The project uses a feature-branch workflow. Each member worked on a dedicated branch and
          opened a pull request into <span className="inline-code">develop</span> for review before
          merging. The final state was merged into <span className="inline-code">main</span> for
          submission.
        </p>

        <div className="branch-list">
          <div className="branch-row branch-main">
            <span className="material-symbols-rounded">commit</span>
            <div>
              <strong>main</strong>
              <span className="branch-desc">Submission branch — stable, reviewed, buildable</span>
            </div>
          </div>
          <div className="branch-row branch-develop">
            <span className="material-symbols-rounded">merge</span>
            <div>
              <strong>develop</strong>
              <span className="branch-desc">Integration branch — all features merged here via PR before main</span>
            </div>
          </div>
          <div className="branch-row branch-feature">
            <span className="material-symbols-rounded">fork_right</span>
            <div>
              <strong>feature/ibadah-bookmark</strong>
              <span className="branch-desc">Home, prayer schedule, doa list &amp; detail, bookmark — Onic</span>
            </div>
          </div>
          <div className="branch-row branch-feature">
            <span className="material-symbols-rounded">fork_right</span>
            <div>
              <strong>feature/al-quran</strong>
              <span className="branch-desc">Tab navigation, surah list, surah detail — Mahardika</span>
            </div>
          </div>
          <div className="branch-row branch-feature">
            <span className="material-symbols-rounded">fork_right</span>
            <div>
              <strong>feature/profile</strong>
              <span className="branch-desc">Auth screens, profile, Clerk integration — Affan</span>
            </div>
          </div>
          <div className="branch-row branch-feature">
            <span className="material-symbols-rounded">fork_right</span>
            <div>
              <strong>feature/eas-build</strong>
              <span className="branch-desc">EAS configuration, standalone APK pipeline — Guruh</span>
            </div>
          </div>
          <div className="branch-row branch-feature">
            <span className="material-symbols-rounded">fork_right</span>
            <div>
              <strong>documentation</strong>
              <span className="branch-desc">README, screenshots, .md files — Mahardika &amp; Affan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Contributions ───────────────────────────── */}
      <section className="section" aria-labelledby="contrib-heading">
        <h2 id="contrib-heading">Contributions</h2>
        <p style={{ fontSize: 15, color: "var(--text-dim)", marginBottom: 24, lineHeight: 1.6 }}>
          Commit history from the project Git log, grouped by author. All 4 team members are from{" "}
          <strong style={{ color: "var(--text)" }}>Universitas Muhammadiyah Surakarta (UMS)</strong>.
        </p>

        {/* Onic */}
        <div className="contrib-block">
          <div className="contrib-header">
            <div className="contrib-meta">
              <strong>Onic Agustino</strong>
              <span className="contrib-nim">L200234275</span>
            </div>
            <span className="contrib-role-tag">Home · Prayer · Doa · Bookmark</span>
          </div>
          <ul className="commit-list">
            <li><span className="sha">a0bdc1e</span>feat: setup baseline project configuration and UI components</li>
            <li><span className="sha">646ca91</span>feat(constants): add hardcoded prayer (doa) data</li>
            <li><span className="sha">d642d4f</span>feat(doa): add daily prayer list screen</li>
            <li><span className="sha">de0ce6b</span>feat(doa): add prayer detail screen by category</li>
            <li><span className="sha">bceca88</span>feat(salat): add full prayer times schedule screen using Aladhan API</li>
            <li><span className="sha">182bf53</span>feat(home): add home screen with prayer schedules and daily prayers</li>
            <li><span className="sha">d69864e</span>feat(bookmark): add bookmark screen for last read surah</li>
          </ul>
        </div>

        {/* Mahardika */}
        <div className="contrib-block">
          <div className="contrib-header">
            <div className="contrib-meta">
              <strong>Mahardika Fatwa Ramadhan</strong>
              <span className="contrib-nim">L200248067</span>
            </div>
            <span className="contrib-role-tag">Al-Quran · Navigation · Documentation</span>
          </div>
          <ul className="commit-list">
            <li><span className="sha">f4ab1cf</span>add layout for bottom tab navigation</li>
            <li><span className="sha">17c894c</span>add quran interface</li>
            <li><span className="sha">dd49d25</span>adding surah id and list</li>
            <li><span className="sha">ec573f7</span>Create documentation folder, add placeholder.txt</li>
            <li><span className="sha">01b32f7</span>add .md files for documentation</li>
            <li><span className="sha">b9fb4fb</span>Add files via upload</li>
            <li><span className="sha">ce178d7</span>add home screenshot</li>
            <li><span className="sha">c3a8ee1</span>add prayer screenshot</li>
            <li><span className="sha">5fb0d81</span>add kiblat screenshots</li>
            <li><span className="sha">d8a2cc5</span>add surah screenshots</li>
            <li><span className="sha">f69f730</span>add doa screenshots</li>
            <li><span className="sha">cbe4e10</span>add calendar screenshots</li>
            <li><span className="sha">d611ca3</span>add bookmark screenshot</li>
            <li><span className="sha">0ec14cf</span>Enhance README with more project screenshots</li>
          </ul>
        </div>

        {/* Guruh */}
        <div className="contrib-block">
          <div className="contrib-header">
            <div className="contrib-meta">
              <strong>Guruh Widisaputra</strong>
              <span className="contrib-nim">L200244058</span>
            </div>
            <span className="contrib-role-tag">EAS Build · Project Setup</span>
          </div>
          <ul className="commit-list">
            <li><span className="sha">2416c43</span>feat: initialize project with Expo and TypeScript setup</li>
            <li><span className="sha">c9f80f4</span>feat: configure EAS build for standalone APK</li>
            <li><span className="sha">e1e925d</span>Merge develop into feature/eas-build</li>
            <li><span className="sha">1db4bcb</span>Merge pull request #6 from feature/eas-build</li>
            <li><span className="sha">d4afd1a</span>Merge pull request #8 from develop</li>
          </ul>
        </div>

        {/* Affan */}
        <div className="contrib-block">
          <div className="contrib-header">
            <div className="contrib-meta">
              <strong>Affan Ilham Arsyila</strong>
              <span className="contrib-nim">L200234024</span>
            </div>
            <span className="contrib-role-tag">Auth · Profile · Audio · Salat Hook · Showcase</span>
          </div>
          <ul className="commit-list">
            <li><span className="sha">e3b6619</span>feat(auth): add sign-in and sign-up screens with Clerk integration</li>
            <li><span className="sha">f64795b</span>feat(profile): add profile screen with user information and settings</li>
            <li><span className="sha">40fedac</span>refactor: remove unused components and consolidate authentication layout</li>
            <li><span className="sha">4d1a306</span>refactor: remove unused files, update Clerk integration</li>
            <li><span className="sha">982dd6d</span>feat: integrate audio playback and bookmarking features</li>
            <li><span className="sha">0eb6b1e</span>feat: update dependencies and add salat schedule hook</li>
            <li><span className="sha">d859623</span>fix: update default user name and email for unauthenticated users</li>
            <li><span className="sha">26a1d04</span>refactor: remove prototype component</li>
            <li><span className="sha">857dfe3</span>docs: update team member details in project documentation</li>
            <li><span className="sha">321832a</span>docs: update formatting and enhance clarity in README</li>
            <li><span className="sha">0b162b6</span>docs: update team member contributions in README</li>
            <li><span className="sha">a7509a8</span>feat: initialize showcase project with Next.js and TypeScript</li>
          </ul>
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
