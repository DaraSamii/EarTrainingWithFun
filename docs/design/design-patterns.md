# Design Patterns

> Design · v0.1 · The recurring UX patterns (what the learner sees) and software patterns (how the code is shaped). New features reuse these before inventing new ones.

## Part A · UX patterns

### A1. The Path (home screen)
- A vertical, scrolling path of **node bubbles** that snakes left/right, grouped by unit headers (a sticky unit banner shows the unit title and a "Tip" button).
- The current node is larger, pulses gently and has a "Start" pill above it. Locked nodes are visible but muted, so learners see where they are going.
- Paper-cut decorative shapes (DESIGN.md) sit between units as section dividers, one shape set per Section A–F, which gives each section its own identity.
- Top bar (mobile): streak flame + count · daily-goal ring · avatar. Bottom tab bar: **Path · Practice · Games · Profile**.

### A2. The Lesson loop (the core screen)
```
┌───────────────────────────────┐
│ ✕   ▓▓▓▓▓▓░░░░░░  (progress)    │  ← exit + session progress bar
│                               │
│   "Which degree is this?"     │  ← one-line instruction
│        ( ▶ Replay )  (🎵 Key)   │  ← replay prompt / replay context
│                               │
│  [1] [2] [3] [4] [5]          │  ← answer area (buttons / piano / fretboard / tap pad)
│                               │
│ ───────────────────────────── │
│ [          CHECK           ]  │  ← single primary action, thumb zone
└───────────────────────────────┘
```
- **Select, then Check** (two-step) for multi-note answers (Echo, Build); **tap = answer** for single-choice K1 items, so drills stay fast. Both are configurable per mechanic.
- **Feedback sheet** slides up from the bottom: green (correct) or red (incorrect) fill with ink text, an icon and the one-line explanation, plus "Hear the difference" (plays the learner's answer, then the correct one) and **Continue**.
- **Combo** indicator after 3 correct answers in a row (a small flame burst; never blocks input).
- Wrong items are **re-queued** at the end of the session (Duolingo's pattern), so every session ends on success.
- **Session end:** XP earned, accuracy, time, streak update with animation, any achievement unlocked, then a "Continue" back to the path.

### A3. Try before sign-up (deferred account creation)
- The first lesson starts from the landing page in **≤ 2 taps**, with no account (Firebase anonymous auth).
- After the first session: "Save your progress", with Continue with Google (links the anonymous account, so no progress is lost) or "Later".
- Sign-in is also reachable from Profile at any time.

### A4. Onboarding
1. Why are you here? (instrument player / singer / student / curious), used only for copy tone and default instrument.
2. Daily goal picker (Casual / Regular / Serious / Intense).
3. "Start from scratch" or "Find my level" (placement, v1).
4. Audio check: "Tap to hear a note". Unlocks the AudioContext (required on iOS) and shows a volume and silent-switch hint.

### A5. Hints ladder
Replay (free) → replay context (free) → reference mnemonic (e.g. the song for an interval; marks the answer as *assisted*, which halves the XP for that item and rates it "hard" for the scheduler) → never a free reveal before the learner answers.

### A6. Instrument inputs
- **Piano:** 1–2 octaves visible; scrolls horizontally on mobile; keys ≥ 44 px wide in portrait (fewer keys rather than smaller keys). Pressed key lights in iris; correct/incorrect overlays after Check.
- **Fretboard:** 6 strings × 12 frets, landscape-friendly, with a left-handed option.
- **Tap pad:** a large circular button and the spacebar; a one-time latency calibration ("tap along with 8 clicks").

### A7. Empty, loading and error states
- Samples loading: play immediately with the synth, swap to samples when ready (no spinner before the first sound).
- Offline: banner "You're offline; progress will sync later". Lessons keep working.
- Audio blocked: a full-width card "Tap to enable sound" (never a silent failure).

### A8. Motion & feedback
- Spring-based micro-interactions of 150–300 ms; sticker-like "press-down" on buttons (the hard shadow shrinks from 4 px to 0 on active).
- Haptics (where supported): light on answer, success pattern on correct.
- `prefers-reduced-motion` disables the path pulse, confetti and the streak-flame animation.

## Part B · Software patterns

### B1. Folder structure: feature-sliced
```
src/
  app/            # app shell, router, providers, theme
  features/
    path/         # path screen, node states
    lesson/       # lesson loop, feedback sheet, session summary
    games/        # one folder per mechanic (pick/, echo/, tap/...) + game registry
    progress/     # XP, streak, achievements (pure logic + hooks)
    auth/         # Firebase auth hooks
    settings/
  audio/          # audio engine service (the only module that touches Tone.js / Web Audio)
  music/          # PURE music theory: notes, intervals, chords, scales, generators (no React, no audio)
  srs/            # spaced-repetition scheduler (pure)
  data/           # repositories: Firestore + local cache
  ui/             # design-system components (Button, Card, Pill, Sheet, Shape)
  i18n/en.ts      # every UI string
```
Rule: `music/` and `srs/` are pure TypeScript with 100% unit-test coverage targets, and are imported by features, never the reverse.

### B2. Game registry (Strategy pattern)
Each mechanic implements one interface and registers itself; the lesson loop is mechanic-agnostic.
```ts
interface Mechanic<Q, A> {
  id: string;                                         // 'pick' | 'echo' | ...
  generate(level: LevelSpec, rng: Rng): Q;            // deterministic given rng
  play(q: Q, audio: AudioEngine): Promise<void>;      // prompt playback
  Answer: React.FC<{ q: Q; onAnswer(a: A): void }>;   // input UI
  grade(q: Q, a: A): Grade;                           // pure
}
```
Games are data: `{ id, mechanic, skill, levels: LevelSpec[] }` in `games/catalog.ts`.

### B3. Audio engine (Facade + singleton service)
- One `AudioEngine` wraps Tone.js: `unlock()`, `loadInstrument(id)`, `playNotes(notes, opts)`, `playCadence(key)`, `stop()`.
- All playback is **scheduled on the audio clock** (`Tone.now() + lookahead`), never with `setTimeout`, so rhythms are sample-accurate.
- Instruments are lazy-loaded `Tone.Sampler`s with sparse samples (every minor third), and a `Tone.PolySynth` fallback until they are loaded.

### B4. Data: Repository + offline-first
- `ProgressRepository` interface; Firestore implementation with **built-in offline persistence** (IndexedDB), so no custom sync layer is needed.
- Firestore model:
  ```
  users/{uid}                 { displayName, settings, xp, streak{count,lastDay,freezes}, dailyGoal, createdAt }
  users/{uid}/items/{itemId}  { stability, difficulty, due, reps, lapses, lastReview }   ← SRS state
  users/{uid}/nodes/{nodeId}  { bars, completedAt, mastered }
  users/{uid}/sessions/{id}   { gameId, levelId, correct, total, xp, durationMs, at }
  users/{uid}/achievements/{id} { tier, at }
  ```
- Security rules: a user can read and write only `users/{request.auth.uid}/**`; validate field types and that XP never decreases.

### B5. State
- Server/persisted state: Firestore listeners wrapped in small hooks (`useUserDoc`, `useNode`).
- Lesson session state: a local `useReducer` state machine (`idle → prompting → answering → feedback → … → summary`). This is explicit and testable, with no global store needed.
- Add a global store library only when a real cross-feature need appears.

### B6. Routing
- React Router with clean URLs; the build copies `index.html` → `404.html` so GitHub Pages serves deep links.

### B7. Testing pyramid
| Layer | Tool | What |
|---|---|---|
| Unit | Vitest | `music/`, `srs/`, `progress/` rules (streak edge cases across time zones), every `grade()` |
| Component | Vitest + Testing Library | Answer components: keyboard shortcuts, ARIA |
| E2E | Playwright | Anonymous lesson → summary → sign-in prompt; offline lesson |
| Rules | Firebase emulator | Firestore security rules |
