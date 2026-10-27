# Design Criteria

> Design · v0.1 · The quality bar. A feature is not "done" until it meets every criterion that applies to it. Numbers are targets we test, not aspirations.

## 1. Product criteria

| ID | Criterion | How we check |
|---|---|---|
| P1 | First sound plays within **30 s** of landing, with **≤ 2 taps** and no sign-up | E2E test + manual timing on a mid-range phone |
| P2 | A session takes **2–4 minutes** (10–12 items) | Session analytics median |
| P3 | Target accuracy band **80–85%** per session once adaptive difficulty ships | Session analytics |
| P4 | Every exercise follows the rules in [game-catalog.md §4](../knowledge-base/game-catalog.md) (free replay, teaching feedback, no timer outside speed rounds, variability as a parameter, seeded generators, accessible input) | PR checklist |
| P5 | Every pitch exercise offers tonal context (cadence/drone) unless the level is explicitly "no context" | Level spec review |
| P6 | Progress is never lost: anonymous → Google upgrade keeps all data; offline sessions sync | E2E test |
| P7 | No dark patterns (see the ethical guardrails in the learning-science doc) | Design review |

## 2. Visual criteria

Base: [DESIGN.md](../../DESIGN.md). Where DESIGN.md contradicts itself or doesn't fit an app, these resolutions apply:

| Topic | DESIGN.md says | Resolution for this app |
|---|---|---|
| Action color | Iris described as "do not promote to primary CTA", yet the Primary Pill Button is Iris | **Iris `#2727e6` is THE action color** (buttons, active states, selected keys, links). Nothing else is a CTA color. |
| Accent colors on UI | Accents "only as decorative shape fills" | Exception: **feedback states** use Jelly Green (correct) and Marker Red (incorrect) as *fills*, always with **ink text + an icon** (never white text: white on green is 3.0:1). Hi-Yellow fills streak/XP highlights. |
| Font weight | 400 only | Kept. Hierarchy from size and tracking. Numbers (XP, streak) use `tnum`. |
| Fonts | Haas Grot (commercial) | Substitute **Inter** (display & text) + **Martian Mono** (tags/meta), both open-licence; self-hosted with `font-display: swap`. |
| Type scale | Up to 92 px (marketing site) | Mobile app scale caps at 52 px (display) on phones; 72–92 px only on the marketing landing page. Body text is 16 px on phones and 20 px on desktop. |
| Text on canvas | "Don't put text directly on the canvas" | Kept for content blocks; the path and lesson headings may sit on the canvas. |
| Radii | ≥ 16 px everywhere | Kept. Piano keys are the exception (bottom corners 8 px), because they are instruments, not chrome. |

### Dark theme tokens (ADR-001)

| Token | Light | Dark | Verified contrast |
|---|---|---|---|
| `--bg` (canvas) | `#f0f6ff` | `#0d0e1a` | text 17.3:1 / 17.7:1 |
| `--surface` (card) | `#ffffff` | `#171933` | text on dark card 15.8:1 |
| `--surface-2` (wash) | `#e1edff` | `#23264d` | — |
| `--text` | `#111118` | `#f0f6ff` | — |
| `--border` | `#e1edff` | `#2c3060` | — |
| `--action` (fill) | `#2727e6` | `#4545f0` | white label 8.3:1 / 6.3:1; fill vs dark canvas 3.1:1 |
| `--action-text` (links on bg) | `#2727e6` | `#8f8fff` | 7.7:1 / 6.9:1 |
| `--shadow-ink` (hard offset) | `#111118` | `#8f8fff` | — |
| `--success` / `--error` fills | `#16ab59` / `#ff4141` | same | ink text 6.3:1 / 5.5:1 |

Theme follows the system by default, with a manual Light/Dark/System override in Settings.

## 3. Accessibility criteria (WCAG 2.2 AA)

| ID | Criterion |
|---|---|
| A1 | Text contrast ≥ 4.5:1 (≥ 3:1 for ≥ 24 px); UI component boundaries ≥ 3:1 against adjacent colors |
| A2 | Color is never the only signal: correct/incorrect always has an icon + text |
| A3 | Touch targets ≥ 44×44 px; primary action in the bottom thumb zone on mobile |
| A4 | Full keyboard play: `Space` replay, `1–9` answers, `Enter` check/continue, `Esc` exit; piano mapped to `A S D F G H J K` (white) / `W E T Y U` (black) |
| A5 | Screen-reader support: answer buttons and keys have accessible names ("C4", "Perfect fifth"); feedback announced through an `aria-live` region |
| A6 | `prefers-reduced-motion` respected; no flashing above 3 Hz |
| A7 | Visible focus ring: 2 px `--action` outline with a 2 px offset (DESIGN.md input focus) |
| A8 | Rhythm games offer a visual metronome and adjustable tempo (motor and timing accessibility) |

## 4. Audio criteria

| ID | Criterion |
|---|---|
| U1 | All note scheduling on the audio clock; inter-onset jitter < 5 ms |
| U2 | Input-to-sound latency on piano/fretboard taps < 50 ms on a mid-range phone (`latencyHint: 'interactive'`) |
| U3 | First sound never waits on sample download (synth fallback) |
| U4 | Instruments are loudness-normalized (±1 dB perceived across instruments) so timbre changes are not loudness cues |
| U5 | Per-instrument sample payload ≤ 1.5 MB (compressed, sparse sampling); cached by the service worker after first load |
| U6 | Tuning A4 = 440 Hz by default; generators keep notes inside each instrument's natural range |
| U7 | Sample licences CC0/CC-BY only, credited in the About screen |

## 5. Performance & platform criteria

| ID | Criterion |
|---|---|
| F1 | Lighthouse (mobile) ≥ 90 for Performance, Accessibility, Best Practices, SEO |
| F2 | Initial JS ≤ 200 KB gzipped; Firebase and Tone.js loaded on demand where possible |
| F3 | LCP < 2.5 s, INP < 200 ms, CLS < 0.1 on throttled 4G |
| F4 | Installable PWA; lessons work offline after the first visit |
| F5 | Supported: last 2 versions of Chrome, Safari (iOS ≥ 16), Firefox, Edge; layouts from 320 px to 1440 px |

## 6. Privacy & security criteria

| ID | Criterion |
|---|---|
| S1 | Store only what the app needs: profile name/photo from Google, settings, learning data. No analytics SDK that tracks across sites. |
| S2 | Firestore rules restrict each user to their own documents; rules tested in the emulator in CI |
| S3 | "Delete my account and data" in Settings (deletes Firestore docs + auth user) |
| S4 | No secrets in the repo (the Firebase web config is public by design; anything else goes in GitHub secrets) |

## 7. Engineering criteria (Definition of Done)

A PR into `develop` is mergeable when:

- [ ] Follows Conventional Commits; branch named `feature/*`, `fix/*` or `docs/*`
- [ ] CI is green: typecheck, lint, unit tests, build
- [ ] Pure logic (`music/`, `srs/`, `progress/`) has unit tests, including edge cases (time zones, DST, streak boundaries)
- [ ] New UI strings live in `src/i18n/en.ts`
- [ ] Works at 320 px wide, in light and dark themes, and with the keyboard alone
- [ ] Relevant criteria in this document checked off in the PR description
- [ ] `CHANGELOG.md` updated under **[Unreleased]**
- [ ] A design or architecture change adds an ADR to [decisions.md](../decisions.md)

## 8. Design review checklist (for every new screen)

1. What is the **one** primary action? Is it in the thumb zone?
2. Does it use existing patterns (design-patterns Part A) before inventing a new one?
3. Does the first interaction produce sound or feedback within 100 ms?
4. Is there a calm, friendly empty state, loading state and error state?
5. Does it feel like DESIGN.md: pill buttons, hard offset shadows, paper-cut shapes, weight 400?
6. Would it still work for a learner who knows **zero** music theory?
