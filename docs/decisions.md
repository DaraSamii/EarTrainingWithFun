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
