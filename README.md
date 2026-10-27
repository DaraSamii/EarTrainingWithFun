# EarTrainingWithFun 🎵

A Duolingo-style ear-training web app: short daily lessons, streaks, a learning path from zero to advanced, and games for pitch, intervals, scale degrees, melody, chords and rhythm.

- **Live:** https://darasamii.github.io/EarTrainingWithFun/ (after the first release)
- **Stack:** React + Vite + TypeScript · Tone.js · Firebase (Google sign-in, Firestore) · GitHub Pages · PWA

## Documentation

| Doc | What's in it |
|---|---|
| [Ear-training methods](docs/knowledge-base/ear-training-methods.md) | Skill taxonomy, 14 practice methods, competitive analysis (Theta Music Trainer and others) |
| [Game catalog](docs/knowledge-base/game-catalog.md) | Mechanics, every game, level ladders, MVP scope |
| [Learning science & progression](docs/knowledge-base/learning-science-and-progression.md) | Spacing, interleaving, mastery; path structure; XP, streak and achievement rules |
| [Design patterns](docs/design/design-patterns.md) | UX patterns and code architecture |
| [Design criteria](docs/design/design-criteria.md) | Measurable quality bar and Definition of Done |
| [Visual style](DESIGN.md) | Color, type and component tokens |
| [Decision log](docs/decisions.md) | ADRs |
| [Contributing](CONTRIBUTING.md) | Git Flow, commits, versioning, releases |
| [Changelog](CHANGELOG.md) | Every release |

## Develop

```sh
npm ci
npm run dev      # http://localhost:5173/EarTrainingWithFun/
npm run build    # typecheck + production build
npm run lint
```
