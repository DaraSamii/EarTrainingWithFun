# Ear-Training Methods & Competitive Landscape

> Knowledge base · v0.1 · What ear training is, the established ways to practice it, and what existing products teach us.

## 1. Skill taxonomy

We organize every exercise under seven skill domains. This mirrors the categories used by Theta Music Trainer and university aural-skills curricula, so learners and teachers recognize it.

| Domain | What the learner can do when they've mastered it | Beginner → Advanced |
|---|---|---|
| **Pitch** | Tell pitches apart, judge direction and fine tuning | higher/lower (whole tones) → 10-cent differences, across timbres |
| **Tonality** | Feel the key centre; name any note by its scale degree | do/sol/do in major → all chromatic degrees, modes, modulations |
| **Intervals** | Name the distance between two notes | P8/P5 ascending → all intervals, descending, harmonic, compound |
| **Melody** | Remember and reproduce a melody; spot wrong notes | 2-note echo → 8+ note phrases, chromatic, dictation |
| **Harmony** | Hear chord quality, inversion, function, progressions | major vs minor → 7th/extended chords, inversions, modulating progressions |
| **Rhythm** | Keep a pulse, reproduce and read rhythms | quarter/half notes → syncopation, tuplets, compound meter |
| **Sound** | Recognize instruments and timbre | piano vs guitar → ensemble mixes (later: EQ/effects) |

## 2. Established methods

Each method is something we can turn into one or more game mechanics (see [game-catalog.md](game-catalog.md)).

| # | Method | How it works | Evidence / lineage | Strength | Weakness | Use in our app |
|---|---|---|---|---|---|---|
| M1 | **Discrimination** (same/different, higher/lower) | Two stimuli, binary judgment | Psychoacoustics; the first stage of Gordon's *Music Learning Theory* | Zero theory needed; good for total beginners | Low ceiling | Entry level of Pitch |
| M2 | **Closed-set identification** | Hear X, choose its name from N options | Classic interval/chord drills (EarMaster, musictheory.net) | Fast reps, easy to grade | Isolated intervals transfer poorly to real music | Intervals, chord quality; always paired with M3 context |
| M3 | **Functional / tonal-context training** | A cadence establishes the key, then the learner names the scale degree of a note; the app plays its resolution to the tonic | Alain Benbassat's *Functional Ear Trainer*; movable-do pedagogy | Builds relative pitch the way music is actually heard; fast early wins | Needs a tonal frame on every question | **Flagship approach.** Spine of the Tonality and Melody tracks |
| M4 | **Reference-song mnemonics** | Link an interval to a song opening (P4 = "Here Comes the Bride") | Widespread teaching aid | Instant first anchor | A crutch; slow at speed; culture-specific | Optional hint layer, faded out at higher levels |
| M5 | **Solfège** (movable-do / fixed-do) | Syllables name scale functions or absolute pitches | Kodály (movable), Romance-language conservatories (fixed) | A verbal label that carries function | Unfamiliar to beginners | Label mode in settings; letters by default (ADR-006) |
| M6 | **Audiation** | Hearing music internally with understanding: predict the next note, then check | Edwin Gordon, *Music Learning Theory* | Deepest form of the skill | Hard to grade | "Predict-then-reveal" items: the learner commits, then hears |
| M7 | **Call-and-response / play-back** | Hear a phrase, play it back on an instrument | Suzuki and oral traditions; Theta's *Parrot Phrases* | Connects ear to hands | Needs an instrument UI | On-screen piano and fretboard echo games |
| M8 | **Dictation** | Hear a melody, rhythm or progression and write it down | Core of university aural skills (Karpinski, *Aural Skills Acquisition*, 2000) | Integrates memory, tonality, rhythm and notation | High cognitive load; slow | Advanced units; chunked into short fragments |
| M9 | **Error detection** | Hear a melody twice and find the changed or out-of-tune note | Theta's *Dango Brothers*; choir/ensemble rehearsal practice | Trains attention and comparison | Needs a "correct" reference | Melody and Pitch games |
| M10 | **Bass-first harmonic hearing** | Track the bass line, then infer the Roman-numeral function | Common jazz and commercial pedagogy | Makes progressions tractable | Requires scale-degree hearing first | Progression units after Tonality unit 3 |
| M11 | **Rhythmic tap-back / reading** | Tap the pulse or the pattern; match a heard rhythm to notation | Dalcroze, Takadimi/Kodály rhythm syllables | Embodied and immediate | Input latency must be calibrated | Rhythm track (tap button, keyboard) |
| M12 | **Timbre identification** | Name the instrument or effect | Theta's *Sound* category; audio-engineering ear training | Cheap once multiple instruments are loaded | Peripheral to core musicianship | Small Sound track; also used as *variability* in other games |
| M13 | **Singing / pitch matching** | Sing a target note; mic pitch detection | Kodály; Theta's *Vocal Match* | Strongest internalization | Mic permissions, noisy rooms, detection errors | **Out of scope for v1** (ADR-005); revisit later |
| M14 | **Real-music transcription** | Identify chords and melodies in real recordings | Musicians' traditional path | Highest transfer | Licensing; grading difficulty | Out of scope; possibly "listen-along" with licensed or CC clips later |

### Principles distilled from these methods

1. **Context first.** Present pitch content inside a key (a cadence or drone) by default. Isolated intervals are a secondary drill, not the backbone (M3 > M2).
2. **Contrast before nuance.** Start with maximally different categories (major vs minor; octave vs second), then narrow the gaps. This is the same idea as contrast-fading in perceptual learning.
3. **Order of presentation:** ascending melodic → descending melodic → harmonic (simultaneous); close position → open voicings; one instrument → many.
4. **High variability for transfer.** Once a category is learned, vary instrument, register, key and tempo. Training on many talkers generalizes better than training on one (Logan, Lively & Pisoni, 1991); the same logic applies to timbre and register.
5. **Accuracy before speed.** Fluency (speed rounds) unlocks only after accuracy holds above the mastery threshold.
6. **Produce, don't just recognize.** Each recognition skill has a production counterpart, such as building an interval or playing back a melody (M7). Retrieval through production is stronger.
7. **Commit before reveal.** The learner answers before the explanation or resolution plays (M6). Never auto-reveal on a timer.

## 3. Competitive landscape

| Product | Model | What to borrow | What to avoid |
|---|---|---|---|
| **Theta Music Trainer** (trainer.thetamusic.com) | About 50 arcade games in 7 categories (Sound, Pitch, Rhythm, Tonality, Intervals, Melody, Harmony) plus courses (Basic / Intermediate / Advanced I–III); rank tiers Beginner → Grandmaster; teacher accounts | Broad category coverage; game-ified mechanics (drops, puzzles, speed); multiple instruments per game; courses that bundle games by level; progress reports | Paywall after level 3 with weekly credits; Flash-era visual style; games feel disconnected (no single path); no spaced review |
| **Functional Ear Trainer** (Benbassat) | Cadence, then a note, then name the degree; the resolution is played | The functional method itself; resolution-to-tonic feedback | Minimal UX and gamification |
| **Complete Ear Trainer** | Chapters of drills unlocked by stars | Duolingo-like unlock path for ear training; clear per-drill star goals | Drill-only; little variety; no review scheduling |
| **EarMaster** | Desktop/mobile, comprehensive drills, sight-singing with mic | Depth of the advanced curriculum; customizable drills | Dense, expert-oriented UI; steep for beginners |
| **ToneGym** | Web games, daily challenges, leaderboards | Short daily challenges; polished web audio | Most depth behind a subscription |
| **musictheory.net** | Free lessons plus exercises | Clean explanation-then-exercise pairing | No progression or memory model |
| **Duolingo** (not music ear training) | Path of units/lessons, XP, streaks, leagues, spaced practice (half-life regression) | Retention loop: streak, daily goal, short sessions, a single path, review woven into the path | Hearts/energy that punish mistakes; guilt-heavy notifications |

### Theta Music Trainer catalog (reference, Oct 2026)

| Category | Games (mechanic in brief) |
|---|---|
| Sound | Channel Scramble (loudest instrument), Band Match (which instruments), EQ Match, Flash Effects |
| Pitch | Pitch Compare (two notes, different instruments), Speed Pitch (rapid comparisons), Dango Brothers (fix the off-pitch notes), Vocal Match (sing) |
| Rhythm | Rhythm Puzzles, Flash Rhythms (rhythm → notation), Rhythm Repeat (tap back), Rhythm Reader, Flash Styles (drum styles) |
| Tonality | Tonic Finder (find the key), Number Blaster (scale-degree numbers), Paddle Tones and Tone Drops (scale tones), Tonal Recall (tone memory), Vocal Degrees, Flash Tones, Key Puzzles (circle of fifths) |
| Intervals | Melodic and Harmonic Drops, Flash Intervals, Two Tones Major/Minor (play back 2nds/3rds), Flash Notation (intervals) |
| Melody | Parrot Phrases (play back on piano), Three Tones / More Tones (play back patterns), Vocal Steps |
| Harmony | Chord Drops (function), Flash Chords, Tone Trees (chord tones), Speed Chords (quality and inversion), Chord Spells, Chord Locks (function, quality and inversion), Speaker Chords (pop progressions), Flash Progressions, Flash Cadences |

**Takeaway:** Theta proves that one game *mechanic* can be reused across content (the "Flash" and "Drops" families). We copy that architecture: a few mechanics × many content sets × a single learning path. We do not copy the names or the paywall.

## Sources

- Theta Music Trainer — https://trainer.thetamusic.com/index.php/en
- Musical U, Theta Music launch overview — https://www.musical-u.com/learn/theta-music-launches-new-online-ear-training-games/
- Karpinski, G. (2000). *Aural Skills Acquisition*. Oxford University Press.
- Gordon, E. *Learning Sequences in Music: A Contemporary Music Learning Theory*. GIA.
- Logan, J., Lively, S., & Pisoni, D. (1991). Training Japanese listeners to identify English /r/ and /l/. *JASA* 89(2).
- Aural Skills Pedagogy: From Academic Research to the Everyday Classroom (Texas State, 2011) — https://digital.library.txstate.edu/handle/10877/3305
