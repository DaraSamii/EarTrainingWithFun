# Learning Science, Progression & Gamification

> Knowledge base · v0.1 · How the learner moves from zero to advanced, why that design works, and the Duolingo-style retention loop.

## 1. Learning principles → product rules

| Principle | Finding | Product rule |
|---|---|---|
| **Retrieval practice** | Being tested produces more long-term retention than restudying (Roediger & Karpicke, 2006) | Every lesson is made of questions, not explanations. Theory appears as 1-screen "tips" before a unit, never as a wall of text. |
| **Spacing** | Distributed practice beats massed practice, and the optimal gap grows with the retention interval (Cepeda et al., 2006) | Every item has a memory state; review sessions pull items that are *due*. |
| **Interleaving** | Mixing categories improves discrimination between them (Kornell & Bjork, 2008) | Inside a level, answer options are interleaved from the start. The Practice mode mixes games. |
| **Desirable difficulties** | Conditions that slow initial learning (spacing, variation, testing) often improve retention (Bjork, 1994) | Variability (instrument, register, key) increases with level; but see flow below. |
| **Flow / optimal challenge** | Engagement peaks when challenge matches skill (Csikszentmihalyi) | Target **~80–85% accuracy** per session. The adaptive engine adds or removes distractors to stay in that band. |
| **Mastery learning** | Progress only after a mastery criterion is met (Bloom, 1968) | A level is "complete" at ≥ 80% accuracy over its last 20 items; the next node unlocks. |
| **Cognitive load** | Working memory is limited; split attention hurts (Sweller, 1988) | One new item per lesson, at most. One primary action per screen. Melodies are chunked to 2–4 notes at first. |
| **Feedback** | Immediate, specific, task-level feedback is the most effective kind (Hattie & Timperley, 2007) | Feedback within 100 ms of answering; play the correct and the chosen answer side by side; show the musical explanation in one line. |
| **High-variability training** | Variable exemplars improve transfer of perceptual categories (Logan, Lively & Pisoni, 1991) | After an item is learned in one timbre, it reappears across instruments, octaves and keys. |
| **Self-determination** | Motivation needs autonomy, competence and relatedness (Deci & Ryan) | Choose the daily goal and focus area (autonomy); visible mastery (competence); shareable streaks and achievements (relatedness, light). |
| **Spaced-repetition models** | Duolingo models per-word forgetting with half-life regression (Settles & Meeder, 2016); FSRS is a modern open-source scheduler | Use an FSRS-style scheduler per item (stability, difficulty, last review). A correct-but-slow or replay-heavy answer counts as a "hard" rating. |

## 2. Progression structure (Duolingo-style)

```
Path
 └─ Section (A: Foundations … F: Mastery)       ← big milestones, section badge
     └─ Unit (e.g. "Major scale degrees I")     ← themed, has a 1-screen tip
         └─ Node (a lesson bubble on the path)  ← one game × one level
             └─ Session (10–12 questions, ~2–4 min)
```

- **One linear path** with optional side-branches. The learner never has to pick which game to play to make progress, though the game library stays available for free practice.
- **Node states:** `locked → available → in progress (1–5 bars) → complete → mastered (legendary)`. Completing a node requires several sessions (the "5 bars"), spread across days by design.
- **Unit review node** at the end of each unit: an interleaved session over all the unit's items.
- **Decay:** items that are overdue in the scheduler mark their node as *needs review* (a subtle crack icon). The learner's progress never goes backwards visually; this is an invitation to review, not a penalty.
- **Placement test** (v1) lets experienced musicians skip ahead.

### Curriculum outline (beginner → advanced)

| Section | Units (in path order; games are interleaved inside units) |
|---|---|
| **A · First Sounds** | Higher or lower · Do and Sol (Degree Detective 1-5) · Major vs minor (Chord Colors) · Steady beat (Tap Back quarters) · Octave & fifth (Interval Ladder) · 2-note Echo |
| **B · The Major Scale** | Degrees 1-2-3, then 1–5, then all diatonic · Thirds and fourths · Eighth notes · 3-note Echo · Who's playing? |
| **C · Chords & Function** | Triad qualities · I–IV–V · Cadences · All simple intervals ascending · Dotted rhythms · 5-note Echo |
| **D · Minor & Colors** | Minor-key degrees · Descending and harmonic intervals · 7th chords · vi and ii · Syncopation · Spot the change |
| **E · Chromatic & Inversions** | Chromatic degrees · Inversions · Secondary dominants · Triplets · 8-note Echo · Interval Builder |
| **F · Mastery** | Modes · Modulation · Compound intervals · Extended chords · Compound meter · Dictation · Speed rounds |

The detailed level parameters per game live in [game-catalog.md](game-catalog.md).

## 3. Engagement loop

```
Daily goal set → short session → immediate feedback + XP → streak extended → achievement / node progress → next session tomorrow
```

### Mechanics in scope (ADR-007)

| Mechanic | Rules |
|---|---|
| **XP** | +10 per completed session, +1 per correct answer, +5 bonus for a perfect session, ×1.5 on a Practice (review) session to reward review. No XP for replays or idle time. |
| **Daily goal** | The learner chooses Casual 20 XP / Regular 50 / Serious 100 / Intense 150. A goal can be changed at any time. |
| **Streak** | +1 when the daily goal is met on a calendar day *in the learner's time zone*. Shown with the flame on the home screen. |
| **Streak freeze** | Earned automatically: 1 freeze per 7-day streak, holding at most 2. A missed day consumes a freeze automatically. **Not purchasable**: no currency in v1. |
| **Streak repair** | Within 48 h of a broken streak, completing 2 sessions restores it (once per month). This softens the "all or nothing" cliff. |
| **Achievements** | Tiered badges (bronze/silver/gold). See the list below. |
| **Excluded** | Hearts/lives, leagues/leaderboards, paid currency (gems). Rationale: mistakes are how perception is learned; punishing them encourages guessing less and quitting more. Leagues need moderation and a social backend. |

### Achievements (v1 set)

| Badge | Tiers |
|---|---|
| **On Fire** (streak) | 3 / 7 / 30 / 100 / 365 days |
| **Sharp Ears** (perfect sessions) | 1 / 10 / 50 |
| **Scholar** (sections completed) | A / C / F |
| **Night Owl / Early Bird** | a session after 23:00 / before 07:00 |
| **Polyglot Ears** (Who's Playing mastered on all instruments) | 1 tier |
| **Perfect Pitch-ish** (Higher or Lower at 10 ¢) | 1 tier |
| **Legend** (mastered nodes) | 1 / 10 / 50 |
| **Comeback** (repaired a streak) | 1 tier |

## 4. Ethical guardrails (non-negotiable)

1. **No guilt-tripping.** Notifications (when added) are opt-in, at most one per day, with neutral wording.
2. **No pay-to-win and no dark patterns.** No countdowns, fake scarcity or confirm-shaming.
3. **Wrong answers are never punished.** They earn less XP than correct ones; that's all.
4. **Breaks are fine.** The streak can be frozen; the learner can pause the streak in settings (vacation mode).
5. **Progress is honest.** Mastery is computed from data, never inflated to drive engagement.

## Sources

- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning. *Psychological Science*, 17(3).
- Cepeda, N. J., et al. (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin*, 132(3).
- Kornell, N., & Bjork, R. A. (2008). Learning concepts and categories: Is spacing the "enemy of induction"? *Psychological Science*, 19(6).
- Bjork, R. A. (1994). Memory and metamemory considerations in the training of human beings.
- Bloom, B. S. (1968). Learning for mastery. *Evaluation Comment*, 1(2).
- Sweller, J. (1988). Cognitive load during problem solving. *Cognitive Science*, 12(2).
- Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research*, 77(1).
- Settles, B., & Meeder, B. (2016). A trainable spaced repetition model for language learning. *ACL*.
- FSRS (Free Spaced Repetition Scheduler) — https://github.com/open-spaced-repetition
- Csikszentmihalyi, M. (1990). *Flow*.
- Deci, E. L., & Ryan, R. M. (2000). Self-determination theory. *American Psychologist*, 55(1).
