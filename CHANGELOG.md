# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added
- **Courses** (ADR-017): Pitch, Intervals, Scales & Keys, Melody, Harmony, Sounds, Music Theory, each with its own path page; the Courses tab; Games tab grouped by course or all.
- **The Journey** on Home: one roadmap through every game, with a "Jump back in" card for the next level.
- **7 new games**, each with Learn → Practice → Play and 5 levels: Higher or Lower, Scale Shapes, Contour Catcher, Chord Colors, Who's Playing?, Note Reader (staff reading), Key Signatures (theory concepts).
- **Drops** arcade (falling items; a wrong answer lurches the item down); Breaker and Blaster now work for any game.
- **Real instruments** (ADR-018): 12 sampled instruments (piano, flute, guitar, trumpet, violin, cello, clarinet, saxophone, xylophone, French horn, trombone, harp) with microtone repitching and synth fallback.
- Hand-drawn **music staff** (treble/bass clef, key signatures, ledger lines) and **melodic contour** drawings as answer faces.
- Home **stat panels** after Duolingo: streak week calendar, daily-goal picker with 7-day XP chart, stars by course; XP history per day.
- Three new paper worlds: Paper Peaks, Bubble Reef, Paper Notebook; course colors; Explorer badge.
- Theme toggle (sun/moon) in the top bar; light mode is the default.
- Motion: page transitions, staggered path nodes and cards, Pip blinking, hover lifts, animated meters.

### Changed
- Practice: feedback and Continue now appear directly under the answers instead of a bottom sheet (ADR-019).
- Every full-screen page has Home + Back buttons; levels remember where they were opened from.
- Patterned backgrounds everywhere (paper confetti + dot grid); game pages use their world's tint.
- The scrolling ticker became static tag pills.
- Levels unlock per game (previous level of the same game), not along a single path.


## [0.3.0] - 2026-10-27 · Game worlds

Every level is now Learn → Practice → Play, with two arcade games, the mascot Pip, stars and badges.

### Added
- **Learn → Practice → Play** for every level (ADR-013): a level screen gates the steps. Learn is Pip's explanation, a demonstration of each new sound with hints and reference songs, and 3 guided tries. Practice is the calm lesson loop (8 questions). Play is the arcade game. Locked steps cannot be opened, even by URL.
- **Scale Breaker** arcade (Breakout, ADR-016): every brick sings a scale degree; naming it moves the paddle. The ball fades mid-flight from level 2 (scaffold fading), keys change every 3 bricks on level 5, and a miss replays the answer and its resolution.
- **Interval Blaster** arcade (shooter, ADR-016): paper ships carry interval names; the cannon aims and fires; a wrong shot costs 1.5 s and raises a shield; on timeout the answer escapes and replays.
- Arcade shell: "Ready?" overlay with Pip, 3-2-1 countdown, segment progress, score, combo multiplier (×1.5 → ×3), score pop-ups, speed bonus. No lives: a round always finishes (ADR-014).
- Stars (1–3 per level, 2 completes it), best score, best combo; results screen with count-up, star pop, confetti.
- Badges (7) with paper medallions, a toast on unlock, and a gallery in Profile.
- Mascot **Pip**, a paper-cut bird with headphones and five moods (ADR-015); paper-cut worlds (Sunset Garden, Paper Space); paper confetti.
- Home redesign: marquee ticker, Pip greeting, streak/goal/stars cards, unit progress, stars under nodes, Pip standing at the current node.
- Unpitched sound effects (pop, zap, boom, whoosh, cheer) with an on/off setting.
- Docs: Theta deep-dive (mechanics, shared shell), ADR-013–016, game catalog K8/K9, design patterns A9–A12.

### Changed
- Degree Detective → Scale Breaker and Interval Ladder → Interval Blaster (game ids unchanged, so saved progress carries over).
- Path nodes open the level screen instead of jumping into a game.

## [0.2.0] - 2026-10-27 · First playable demo

First public release: knowledge base, design system and a playable demo with two games.

### Added
- Decision log with ADR-001…011 from the kickoff interview.
- Knowledge base: ear-training methods and competitive analysis, game catalog, learning science and progression.
- Design patterns (UX and software) and measurable design criteria, including dark-theme tokens.
- Repository conventions: README, CONTRIBUTING (Git Flow, Conventional Commits, SemVer, release procedure), changelog, PR template.
- Project skeleton: React + Vite + TypeScript, design tokens (light and dark), CI and GitHub Pages deployment.
- App shell: top bar with streak, XP and daily-goal ring; tab navigation (bottom on phones, top on desktop); hash routing.
- Home path (Section A): three units of interleaved level nodes with locked/current/done states and a "coming soon" unit.
- **Degree Detective** (levels 1–5): a cadence sets the key, the learner names the scale degree, and the note resolves to the tonic.
- **Interval Ladder** (levels 1–5): octave/fifth up to steps and skips, then descending intervals.
- Lesson loop: replay, "hear the key", tap or 1–9 to answer, feedback sheet with "hear the difference", missed questions re-asked, combo counter, session summary.
- Progress: XP, daily goal, streak (local time zone), level completion at 80%; saved on the device.
- Games library and Profile screen with stats, theme switch (system/light/dark) and progress reset.
- Synth audio engine scheduled on the audio clock; unit tests for generators and progress rules.

[Unreleased]: https://github.com/DaraSamii/EarTrainingWithFun/compare/v0.3.0...develop
[0.3.0]: https://github.com/DaraSamii/EarTrainingWithFun/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/DaraSamii/EarTrainingWithFun/releases/tag/v0.2.0
