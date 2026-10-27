# Decision Log (ADRs)

Lightweight Architecture/Product Decision Records. Append new entries; never rewrite history. To reverse a decision, add a new ADR that **supersedes** the old one.

Format: `ADR-NNN · Title · Status · Date` → Context / Decision / Consequences.

---

### ADR-001 · Visual direction: DESIGN.md + dark mode · Accepted · 2026-10-27
**Context:** A SuperHi-derived style reference ([DESIGN.md](../DESIGN.md)) already exists.
**Decision:** Use it as the visual base and add a dark theme. Conflicts inside DESIGN.md are resolved in [design/design-criteria.md §2](design/design-criteria.md).
**Consequences:** Every color is a CSS custom property with a light and a dark value.

### ADR-002 · Firebase for auth and data · Accepted · 2026-10-27
**Context:** GitHub Pages is static hosting; learners must sign in with Google and keep progress and settings.
**Decision:** Firebase Authentication (Google provider, plus anonymous sign-in for try-before-signup, linked on upgrade) and Cloud Firestore with offline persistence. Free Spark plan.
**Consequences:** Firebase web config is public by design; security comes from Firestore rules (`request.auth.uid == userId`). There is no server code. Vendor lock-in is accepted.

### ADR-003 · Audience: total beginner → advanced · Accepted · 2026-10-27
**Decision:** Assume no theory knowledge on day 1; the path reaches university aural-skills level (Section F).
**Consequences:** Each unit needs a one-screen tip; a placement test is required for experienced users (v1).

### ADR-004 · Multiple instruments from day 1 · Accepted · 2026-10-27
**Decision:** Ship sampled piano, acoustic guitar and at least one sustained instrument (strings) from the first playable release, with a synth fallback while samples load.
**Consequences:** Samples are lazy-loaded per instrument and cached by the service worker. The "Who's Playing?" game and timbre variability come almost for free. Sample licences must be CC0/CC-BY and credited.

### ADR-005 · Input modes: buttons + on-screen piano/fretboard · Accepted · 2026-10-27
**Decision:** Multiple-choice buttons, on-screen piano, guitar fretboard, and a tap pad for rhythm. No microphone and no MIDI in v1.
**Consequences:** Singing games (M13) are deferred. Input components must be keyboard- and screen-reader-accessible.

### ADR-006 · Note names: letters by default, solfège optional · Accepted · 2026-10-27
**Decision:** C D E … by default; settings offer movable-do and fixed-do. Scale-degree games show numbers (1–7) with a solfège toggle.
**Consequences:** All note labels go through one formatter that takes the user setting.

### ADR-007 · Gamification: streaks + XP + daily goal + achievements · Accepted · 2026-10-27
**Decision:** Include those four. Exclude hearts/lives, leagues/leaderboards and paid currency.
**Consequences:** No social backend is needed. Rules are in [learning-science-and-progression.md §3](knowledge-base/learning-science-and-progression.md).

### ADR-008 · Stack: React + Vite + TypeScript, mobile-first PWA · Accepted · 2026-10-27
**Decision:** React 19, Vite, strict TypeScript; installable PWA designed for phones first.
**Consequences:** `base` is set to `/EarTrainingWithFun/` for GitHub Pages; SPA deep links need the `404.html` fallback.

### ADR-009 · Git Flow + SemVer + Conventional Commits · Accepted · 2026-10-27
**Decision:** `main` (released), `develop` (integration), `feature/*`, `release/*`, `hotfix/*`. Annotated tags `vX.Y.Z` on `main`. Every merge goes through a PR with a merge commit (`--no-ff`). See [CONTRIBUTING.md](../CONTRIBUTING.md).

### ADR-010 · Language: English, i18n-ready · Accepted · 2026-10-27
**Decision:** English only, but every UI string lives in `src/i18n/en.ts` from the first component.

### ADR-011 · Repository: public GitHub repo `DaraSamii/EarTrainingWithFun` · Accepted · 2026-10-27
**Decision:** A public repo is required for GitHub Pages on the free plan. Deployed from `main` through GitHub Actions.

### ADR-012 · Demo shortcuts: hash routing, localStorage, synth voice · Accepted · 2026-10-27
**Context:** The first playable demo (0.2.0) should ship before Firebase and the sample library exist.
**Decision:** (a) Hash routes (`#/games`, `#/play/degrees/0`) instead of clean URLs; this amends ADR-008 and needs no `404.html` trick. (b) Progress is stored in `localStorage` until Firestore lands in 0.4.0 (ADR-002). (c) A Web Audio synth voice stands in for sampled instruments until 0.3.0 (ADR-004). Each shortcut carries a `shortcut:` comment in code.
**Consequences:** Progress is per device until sign-in ships. Switching to clean URLs later means a redirect from `#/…` paths.

### ADR-013 · Every level is Learn → Practice → Play · Accepted · 2026-10-27
**Context:** The learner must not be able to jump straight into a game without an explanation and a demonstration (user feedback on the 0.2.0 demo).
**Decision:** Each level has three gated steps. **Learn**: the mascot explains the idea, plays a demonstration of every new sound with a hint, then runs 3 guided tries that repeat until correct. **Practice**: the calm lesson loop (no clock, free replay, hints). **Play**: the arcade game. Play unlocks after one finished Practice round; Practice unlocks after Learn. Learn can be replayed at any time.
**Consequences:** A level screen sits between the path and the game. Level progress stores `learned`, `practiced` and `stars`.

### ADR-014 · Play mode has speed and score, never lives · Accepted · 2026-10-27
**Context:** Theta's arcade games use a clock plus lives. ADR-007 excluded hearts, and game-catalog rule 4 allowed timers only in speed rounds.
**Decision:** Play mode is time-pressured (falling ball, wave timer) and scored (speed bonus, combo multiplier). A miss costs time and points only; the round always runs to the end. Stars (1–3) come from first-try accuracy: ≥ 60%, ≥ 80%, ≥ 95%. A level is complete at 2 stars. Learn and Practice stay untimed. This amends game-catalog rule 4.

### ADR-015 · Paper-cut worlds and the mascot Pip · Accepted · 2026-10-27
**Decision:** Each game lives in its own paper-cut scene built from DESIGN.md shapes and colors (Scale Breaker: a sunset garden; Interval Blaster: paper space). A paper-cut bird with headphones, **Pip**, explains in Learn, demonstrates sounds and reacts to results. Celebrations use paper-cut confetti. UI sound effects are unpitched (noise-based), so they never interfere with pitch training, and can be switched off.

### ADR-016 · A different arcade mechanic per game · Accepted · 2026-10-27
**Decision:** Scale degrees → **Scale Breaker** (Breakout, after Theta's Paddle Tones): each broken brick plays a degree, and naming it moves the paddle to catch the ball. From level 2 the ball fades out mid-flight so the ear, not the eye, decides. Intervals → **Interval Blaster** (shooter, after Theta's Number Blaster): each wave plays an interval; shoot the ship carrying its name before the wave timer runs out. The game ids `degrees` and `intervals` are kept so saved progress carries over.

### ADR-017 · Courses, the Journey, and per-game unlocking · Accepted · 2026-10-27
**Context:** Learners asked for skill-specific paths (pitch, intervals, scales, melody, harmony, sounds, theory) and also one "just press play" roadmap (user feedback on 0.3.0).
**Decision:** Seven **courses** group the games by skill; each course page shows its own path. Home shows the **Journey**: one path that interleaves every game's level 1, then every level 2, and so on. The Games tab lists games by course or all together. A level unlocks once the previous level *of the same game* is complete, so the same level can appear in a course path and in the Journey without conflicting. Supersedes the single-path unlock rule from 0.2.0.
**Consequences:** Paths are generated from data (`tiers()`), so adding a game automatically adds it to its course and to the Journey.

### ADR-018 · Sampled instruments from a pinned CDN · Accepted · 2026-10-27
**Decision:** Play real instruments using nbrosowsky/tonejs-instruments (samples CC BY 3.0, credited in Profile → About), loaded at runtime from jsDelivr, **pinned to commit 622c2f1**. A small Web Audio sampler picks the nearest sample and repitches it (which also gives microtones for Higher or Lower). The synth plays until samples are decoded (criteria U3). Instruments are preloaded on the level screen.
**Consequences:** About 3 MB for piano on first use, less for other instruments; still depends on the CDN until the PWA milestone self-hosts and caches the samples. This supersedes the synth-only shortcut in ADR-012(c).

### ADR-019 · Feedback round on 0.3.0: navigation, practice flow, theme, backgrounds · Accepted · 2026-10-27
**Decision:**
(a) Every full-screen page has an **exit bar**: Home plus back to its parent (level → its origin via `?from=`, steps → level).
(b) Practice feedback and **Continue sit directly under the answers** (inline card); the bottom sheet is removed.
(c) **Light mode is the default**, with a sun/moon toggle in the top bar (System stays in Profile).
(d) **No plain backgrounds:** a paper-confetti + dot-grid pattern everywhere; game pages use their world's tint.
(e) The scrolling ticker is replaced by static tag pills, so no text is ever hidden.
(f) Home stat cards **expand into detail panels** (streak week calendar, daily-goal picker + 7-day XP chart, stars by course), after Duolingo.

### ADR-020 · Full curriculum: Rhythm course, 18 games, coverage map · Accepted · 2026-10-27
**Context:** The user asked for the app to cover "all music hearing training in all aspects", with more lessons and units per course.
**Decision:** Add an eighth course, **Rhythm**, and grow to **18 games** (2–3 per course) with 5–8 levels each (110 levels). Harder games join the Journey later (`journeyOffset`), and the Journey is grouped into 10 named sections. Coverage against the skill taxonomy in the knowledge base:

| Skill (methods doc §1) | Covered by |
|---|---|
| Pitch discrimination, fine tuning | Higher or Lower (to 12 cents), Tune Up |
| Intervals, melodic and harmonic | Interval Blaster (all simple intervals, up/down), Twin Notes |
| Tonality / scale degrees, major and minor | Scale Breaker (major + minor, any key) |
| Scales and modes | Scale Shapes (all 7 modes, pentatonic, blues, whole tone, chromatic) |
| Melody: contour and memory | Contour Catcher, Spot the Change |
| Harmony: quality, inversions, function, cadences | Chord Colors, Progression Path, Cadence Call |
| Rhythm and meter | Rhythm Match, Meter Detective |
| Timbre and expression | Who's Playing?, Expression Detective (dynamics, articulation, tempo) |
| Reading (eye ↔ ear) | Note Reader, Interval Reader, Key Signatures |

**Known gaps (by decision, not oversight):** singing and pitch-matching (needs the microphone, excluded in ADR-005); play-back games on the on-screen piano (Echo) and rhythm tap-back need new input mechanics (planned); absolute-pitch training and real-music transcription are out of scope.

### ADR-021 · Hand-drawn SVG icons for games and courses · Accepted · 2026-10-27
**Decision:** Replace text glyphs (↕, ♫, Do, 〰) with paper-cut-style SVG icons drawn in-house (`ui/GameIcon.tsx`): a tuning fork (Pitch), measured note pair (Intervals), note staircase (Scales), flowing note line (Melody), stacked chord (Harmony), drum (Rhythm), plus one icon per game. The treble clef 𝄞 (Music Theory) and violin 🎻 (Sounds) are kept as the user approved them.
