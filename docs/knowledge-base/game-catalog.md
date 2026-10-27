# Game Catalog

> Knowledge base · v0.1 · Which games we build, what each one trains, and how each one levels up.

## 1. Architecture of a "game"

Following Theta's lesson (few mechanics × many content sets), a **game** = one **mechanic** + one **content ladder**:

```
Game = Mechanic (UI + interaction + grader)  ×  Content ladder (ordered item pools, levels 1..N)
```

- **Mechanic:** how a question is asked and answered (pick-a-label, play-it-back, tap-rhythm, find-the-error, …).
- **Item:** the smallest thing we remember about a learner, e.g. `interval:P5:asc`, `degree:major:6`, `chord:min7:root`. The spaced-repetition scheduler works on items (see [learning-science-and-progression.md](learning-science-and-progression.md)).
- **Level:** a set of active items plus presentation settings (instruments, register range, context on/off, tempo).

Every level runs through three modes (ADR-013): **Learn** (mascot explanation, a demonstration of each new sound with a hint, 3 guided tries), **Practice** (the calm K1 lesson loop), **Play** (the game's arcade mechanic, ADR-014/016).

Input modes in scope (ADR-005): **buttons/multiple-choice**, **on-screen piano**, **on-screen guitar fretboard**, and a **tap pad** (button/spacebar) for rhythm. No microphone and no MIDI in v1.

## 2. Mechanics

| ID | Mechanic | Interaction | Grader | Methods (see methods doc) |
|---|---|---|---|---|
| K1 | **Pick** | Hear the prompt, tap one of 2–8 labelled answer buttons (keys 1–9 on a keyboard) | exact match | M1, M2, M3, M12 |
| K2 | **Echo** | Hear a phrase, play it back on the piano or fretboard | note-sequence match (octave-equivalent at low levels) | M7 |
| K3 | **Build** | See a label and a starting note, then play the missing notes | pitch-set match | M2 production side |
| K4 | **Spot** | Hear a reference and a variant; tap the changed note in a note-strip | index match | M9 |
| K5 | **Tap** | Hear a rhythm, tap it back | onset alignment within tolerance windows (latency-calibrated) | M11 |
| K6 | **Predict** | Hear a phrase stop; choose or play what comes next, then hear the real continuation | match | M6 |
| K8 | **Breaker** | Breakout: a broken brick plays the prompt; tap the answer zone to move the paddle and catch the ball before it lands. The ball fades mid-flight from level 2 | zone match + time left | M3, scaffold fading |
| K9 | **Blaster** | Shooter: each wave plays the prompt; shoot the ship with the matching label before the wave timer ends. A wrong shot costs 1.5 s | label match + time left | M2 |
| K7 | **Speed round** | K1 under a soft time pressure; the score is a streak of correct answers | exact match + response time | fluency |

## 3. Game list

**MVP** = ships in the first playable release (v0.3 "First sounds"). **v1** = by 1.0. **Later** = backlog.

### Pitch
| Game | Mechanic | Trains | Level ladder | Release |
|---|---|---|---|---|
| **Higher or Lower** | K1 | Pitch direction and discrimination | 2 semitones apart, same instrument → 1 semitone → 50¢ → 25¢ → 10¢; then different instruments for the two notes | MVP |
| **Tune Up** | K1 (sharp/flat/in tune) | Fine-tuning perception | ±50¢ → ±10¢ | Later |

### Tonality (flagship track: functional hearing)
| Game | Mechanic | Trains | Level ladder | Release |
|---|---|---|---|---|
| **Scale Breaker** (was Degree Detective) | Learn → K1 practice → **K8** play | Name the scale degree of a note after a cadence; the resolution to the tonic plays as feedback | Major: 1-3-5 → 1-2-3 → 1–5 → all diatonic → minor → chromatic degrees; cadence → drone → no context | **MVP** |
| **Home Base** | K1 / K2 | Find the tonic of a short phrase | Clear I–V–I phrases → melodies ending off-tonic → minor/modal | v1 |
| **What Comes Next** | K6 | Audiation: predict the next degree | Step-wise motion → leaps | v1 |

### Intervals
| Game | Mechanic | Trains | Level ladder | Release |
|---|---|---|---|---|
| **Interval Blaster** (was Interval Ladder) | Learn → K1 practice → **K9** play | Interval identification | P8 vs P5 → +M3 → +P4 → +M2/m3 → all simple; ascending → descending → harmonic; in-key → random root | **MVP** |
| **Interval Builder** | K3 | Interval production | Same ladder as Interval Ladder, played on the piano or fretboard | v1 |

### Melody
| Game | Mechanic | Trains | Level ladder | Release |
|---|---|---|---|---|
| **Echo** | K2 | Melodic memory and playback | 2 notes (steps) → 3 → 5 → 8; pentatonic → diatonic → chromatic; given the first note → given only the key | **MVP** |
| **Spot the Change** | K4 | Melodic attention and error detection | 4-note phrase with a large change → 8-note phrase with a semitone change | v1 |
| **Melodic Dictation** | K2 + staff | Write what you hear | Advanced section; chunked 2-bar fragments | Later |

### Harmony
| Game | Mechanic | Trains | Level ladder | Release |
|---|---|---|---|---|
| **Chord Colors** | K1 | Chord quality | maj vs min → +dim/aug → +sus → 7ths (maj7, 7, m7, m7b5, dim7) → inversions | **MVP** |
| **Chord Builder** | K3 | Spell and play chord tones | Triads → 7ths, root position → inversions | v1 |
| **Progression Path** | K1 (sequence of Roman numerals) | Functional progressions | I–V → I–IV–V → +vi → +ii → secondary dominants → minor keys | v1 |
| **Cadence Call** | K1 | Authentic / plagal / half / deceptive | 2 types → 4 | v1 |
| **Bass Walk** | K1 / K2 | Bass-line degrees (bass-first method, M10) | Roots only → inversions | Later |

### Rhythm
| Game | Mechanic | Trains | Level ladder | Release |
|---|---|---|---|---|
| **Tap Back** | K5 | Rhythmic reproduction | Quarters/halves at 80 BPM → eighths → dotted → syncopation → triplets → compound meter | **MVP** |
| **Rhythm Match** | K1 (choose the notation) | Rhythm ↔ notation | Same ladder as Tap Back | v1 |

### Sound
| Game | Mechanic | Trains | Level ladder | Release |
|---|---|---|---|---|
| **Who's Playing?** | K1 | Instrument recognition | 2 contrasting instruments → all loaded instruments → two at once | v1 (cheap because multiple instruments ship on day 1, ADR-004) |

### Cross-skill modes (not separate games)
| Mode | What it does | Release |
|---|---|---|
| **Practice (review)** | An interleaved session of *due* items from every unlocked game, chosen by the scheduler | MVP |
| **Speed round (K7)** | Fluency challenge on a mastered level; awards a "Legendary"-style mastery mark | v1 |
| **Placement test** | About 3 minutes of adaptive items that unlock the path up to the learner's level | v1 |
| **Daily challenge** | One fixed, seeded session per day that's the same for everyone (shareable result) | Later |

## 3b. Implemented games (0.4.0)

| Course | Game | Practice | Play (arcade) | World | Levels |
|---|---|---|---|---|---|
| Pitch | **Higher or Lower** | K1 | Drops | Paper Peaks | 4 → 2 → 1 semitone → 50¢ → 25¢; flute/violin/clarinet from L4 |
| Intervals | **Interval Blaster** | K1 | Blaster | Paper Space | P5/P8 → +M3 → +P4 → 2nds & 3rds → descending |
| Scales & Keys | **Scale Breaker** (degrees) | K1 | Breaker | Sunset Garden | 1-3-5 → 1-2-3 → 1–5 → 1–7 → any key |
| Scales & Keys | **Scale Shapes** | K1 | Blaster | Bubble Reef | major/minor → +pentatonic → +harmonic minor → +melodic minor → dorian/mixolydian |
| Melody | **Contour Catcher** | K1 (contour drawings) | Breaker | Paper Peaks | 3-note rising/falling → arches & valleys → 4 notes + zigzag → leaps → 5 notes |
| Harmony | **Chord Colors** | K1 | Blaster | Bubble Reef | maj/min → +dim → +aug → 7ths → all, unspelled |
| Sounds | **Who's Playing?** | K1 | Drops | Sunset Garden | piano/flute → +guitar → +trumpet, violin → strings & woodwinds → brass, reeds & mallets |
| Music Theory | **Note Reader** (reading) | K1 + staff | Drops (staff cards) | Paper Notebook | treble lines → spaces → whole staff → ledger lines → bass clef |
| Music Theory | **Key Signatures** (concepts) | K1 + staff | Blaster | Paper Notebook | C/G/F → 2 → 3 → 4 → 6 sharps/flats |

Mechanic **K10 · Drops** (after Theta's Tone Drops): an item falls and plays (or shows) the prompt; answer before it lands. A wrong answer makes it lurch down (time penalty). Reading games show the sound only after answering, which links eye and ear.

## 4. Rules every game must follow

1. **Replay is free.** The learner can replay the prompt any number of times without penalty. We record replays for analytics and to adjust difficulty, but they never cost points.
2. **Reference available.** Context (cadence/drone) can be replayed at any time on tonal games.
3. **Feedback teaches.** On a wrong answer, play *both* the correct answer and the learner's answer so the difference is audible.
4. **No timer in Learn or Practice.** Play mode (K7–K9) is timed and scored but has no lives; a round always finishes (ADR-014).
8. **Learn before you play.** No level can be played before its Learn step, and no arcade round before one Practice round (ADR-013).
5. **Variability is a level parameter.** Instrument pool, register and key randomization are part of the level definition, not hard-coded.
6. **Deterministic generators.** Question generation takes a seed, so sessions are reproducible for tests and the daily challenge.
7. **Accessible input.** Every K1 answer has a keyboard shortcut; the piano and fretboard have keyboard mappings and ARIA labels.
