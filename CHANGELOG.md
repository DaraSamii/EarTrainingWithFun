# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added
- **Lesson cards in Learn** (ADR-026): every game has a guide (what it is, how to listen, a common mistake, where you hear it in real music) shown as paged cards before the sound demos, with Back/Next and arrow keys.
- **A unique world for every course**: new Paper River (Melody), Potion Lab (Harmony), Paper Stadium (Rhythm) and Lily Pond (Sounds) scenes; all games in a course share its world.


## [0.7.1] - 2026-10-27 · Hotfix

### Fixed
- Pip's speech bubbles rendered one word per line over the mascot: Potion Lab's cauldron bubbles reused the `.bubble` class. They are now `.brew-bubble`, scoped to the cauldron, with a regression test.

## [0.7.0] - 2026-10-27 · Arcades for every course

Every course plays differently, 25 games, a passing score you choose, and the keyboard works everywhere.

### Added
- **A different arcade for every course** (ADR-024): Peak Climber (Pitch), River Run (Melody), Potion Lab (Harmony), Hurdle Dash (Rhythm), Fishing Pond (Sounds), joining Breaker (Scales), Blaster (Intervals) and Drops (Theory).
- **How to play** list on every arcade's start card and behind a "?" button during play.
- **7 new games**: Note Twins, Bigger Jump, Mood Ring, Steps & Leaps, How Many Notes?, Tempo Check, Instrument Families. 25 games and 169 levels in total.
- **Passing score** in Profile (60–90%): Practice, Play and unit reviews must reach it to move on, otherwise you replay (ADR-025).
- **Score-based messages** (Perfect, Outstanding, Passed, So close, Keep at it) with the pass mark shown.
- **Next activity** button after a passed Play, following the path you came from.
- **Keyboard everywhere**: → next/continue/start, ← back, Esc exit; 1–9 answers in Learn too.

### Changed
- Stage tabs have a sliding highlight.
- Home sidebar: streak, goal, stars and Memory stay put; only the course list scrolls.
- Bubble Reef fish now swim forwards.


## [0.6.0] - 2026-10-27 · Spaced review

What you learn keeps coming back: spaced memory, interleaved practice, unit reviews, and Beginner/Intermediate/Advanced tabs.

### Added
- **Spaced repetition** (ADR-022): every learned sound is a memory item that comes back after 1, 3, 7, 16, 35 and 75 days; misses return tomorrow.
- **Review** sessions: everything due, interleaved across games, worth 1.5× XP, with a Memory card on Home ("N due for review" and memory strength).
- **Unit review** node at the end of every unit in the Journey and course paths (unlocks when the unit is done, passed at 80%).
- Practice rounds now **mix in 2 older due items** (marked "Review").
- **Beginner / Intermediate / Advanced tabs** on Home and every course page, each with progress (ADR-023).
- **More levels** (134 total): Tune Up (low register, 8 cents), Twin Notes (all mixed), Spot the Change (7 notes), Progression Path (iii, deceptive, major/minor mix), Cadence Call (fast), Rhythm Match (syncopated sixteenths, swing), Meter Detective (5/4, 7/8), Expression Detective (all seven), Interval Reader (bass clef), Who's Playing? (full band).
- Steel Trap badge (3 unit reviews).

### Changed
- Page changes animate: the old page fades out while the new one fades in (View Transitions API).
- Home sidebar scrolls on its own when taller than the window (Music Theory was cut off).
- Stat panels close as smoothly as they open.


## [0.5.0] - 2026-10-27 · Full curriculum

Eight courses, 18 games, 110 levels: rhythm, progressions, cadences, expression and reading join pitch, intervals, scales, melody and timbre.

### Added
- **Rhythm course** with Rhythm Match (beat-grid answers) and Meter Detective (2/4, 3/4, 4/4, 6/8), plus a synthesized drum kit.
- **9 new games**: Tune Up, Twin Notes, Spot the Change, Progression Path, Cadence Call, Rhythm Match, Meter Detective, Expression Detective, Interval Reader. 18 games and 110 levels in total; every course now has 2–3 games.
- More levels for existing games: minor keys (Scale Breaker), all modes and color scales (Scale Shapes), sus chords, inversions and all sevenths (Chord Colors), sixths, sevenths and mixed directions (Interval Blaster), quarter-step and low-register pitch, bass ledger lines and mixed clefs, relative minor keys.
- Journey grouped into 10 named sections; harder games join later. Units are named by what they train.
- Dynamics, staccato and drum hits in the audio engine; stacked notes on the staff; Roman-numeral chord voicing.
- Coverage map of skills vs courses (ADR-020).

### Changed
- New hand-drawn SVG icons for courses and games (the treble clef and violin are kept) (ADR-021).
- Larger type throughout (body 18px, captions 13–14px, bigger answer labels).


## [0.4.0] - 2026-10-27 · Courses & real instruments

Seven courses, a Journey through all of them, 7 new games, real sampled instruments, and a design pass from user feedback.

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

[Unreleased]: https://github.com/DaraSamii/EarTrainingWithFun/compare/v0.7.1...develop
[0.7.1]: https://github.com/DaraSamii/EarTrainingWithFun/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/DaraSamii/EarTrainingWithFun/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/DaraSamii/EarTrainingWithFun/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/DaraSamii/EarTrainingWithFun/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/DaraSamii/EarTrainingWithFun/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/DaraSamii/EarTrainingWithFun/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/DaraSamii/EarTrainingWithFun/releases/tag/v0.2.0
