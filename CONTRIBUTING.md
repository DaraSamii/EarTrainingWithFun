# Contributing

## Branching: Git Flow

| Branch | Purpose | Branches from | Merges into |
|---|---|---|---|
| `main` | Released code only. Every commit is tagged and deployed to GitHub Pages | — | — |
| `develop` | Integration branch (repo default) | `main` | `release/*` |
| `feature/<name>` | New work (`feature/degree-detective`) | `develop` | `develop` via PR |
| `fix/<name>` | Non-urgent bug fix | `develop` | `develop` via PR |
| `release/X.Y.Z` | Freeze, version bump, changelog | `develop` | `main` **and** back into `develop` |
| `hotfix/X.Y.Z` | Urgent production fix | `main` | `main` **and** `develop` |

Rules:
- Never commit directly to `main` or `develop`; everything goes through a PR.
- Merge with a **merge commit** (`--no-ff`) so each feature stays visible in history.
- Feature branches are deleted after merge (the repo does this automatically).

## Commits: Conventional Commits

```
<type>(<scope>): <summary in imperative mood>
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`. A breaking change adds a `!` after the type or scope (`feat(srs)!: …`) and a `BREAKING CHANGE:` footer.
Scopes: `kb`, `design`, `decisions`, `app`, `audio`, `music`, `srs`, `games`, `lesson`, `path`, `progress`, `auth`, `data`, `ui`, `i18n`, `ci`.

## Versioning: SemVer

`vMAJOR.MINOR.PATCH` with annotated tags on `main` only. While in `0.x`, MINOR = milestone, PATCH = fixes.

## Release procedure

```sh
git switch develop && git pull
git switch -c release/0.2.0
npm version 0.2.0 --no-git-tag-version          # bump package.json
# move [Unreleased] entries in CHANGELOG.md under ## [0.2.0] - YYYY-MM-DD
git commit -am "chore(release): 0.2.0"
gh pr create --base main --title "Release 0.2.0"  # review, then merge (merge commit)
git switch main && git pull
git tag -a v0.2.0 -m "Release 0.2.0"  && git push origin v0.2.0
gh release create v0.2.0 --notes-from-tag        # or paste the changelog section
git switch develop && git merge --no-ff main && git push   # back-merge
```

## Milestones (roadmap)

| Version | Milestone |
|---|---|
| 0.1.0 | Knowledge base, design criteria, project skeleton (folded into 0.2.0, not tagged separately) |
| 0.2.0 | ✅ First playable demo: app shell, home path, Degree Detective + Interval Ladder L1–5 |
| 0.3.0 | ✅ Game worlds: Learn → Practice → Play, mascot Pip, Scale Breaker + Interval Blaster arcades, stars and badges |
| 0.3.x | Sampled instruments (piano, guitar, strings) |
| 0.4.0 | Firebase: anonymous + Google sign-in, Firestore progress, settings |
| 0.5.0 | Path, XP, streaks, daily goal, achievements |
| 0.6.0 | Echo, Chord Colors, Tap Back; spaced-repetition Practice mode |
| 0.7.0 | PWA offline, performance and accessibility pass against design criteria |
| 1.0.0 | Sections A–C complete, placement test, v1 games |

## Definition of Done

See [design criteria §7](docs/design/design-criteria.md#7-engineering-criteria-definition-of-done).
