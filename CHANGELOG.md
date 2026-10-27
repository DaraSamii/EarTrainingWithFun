# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/DaraSamii/EarTrainingWithFun/compare/v0.2.0...develop
[0.2.0]: https://github.com/DaraSamii/EarTrainingWithFun/releases/tag/v0.2.0
