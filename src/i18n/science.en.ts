// "Why it feels this way": the physics and math behind each skill (user feedback 0.8.0).
// why: perception and acoustics in plain words · math: the numbers · ratio: frequency ratio drawn as waves
type Science = { why: string; math: string; ratio?: number[] }

export const science: Record<string, Science> = {
  pitch: {
    why: 'A note is air vibrating. The faster it vibrates, the higher we hear it. Inside your ear, the cochlea is a coiled tube lined with hair cells: high frequencies shake the cells near the entrance, low ones the cells deep inside. Your brain reads "where" as "how high".',
    math: 'Frequency is measured in hertz (vibrations per second). A4 = 440 Hz. Doubling the frequency raises a note by one octave (A5 = 880 Hz). One half step multiplies the frequency by ¹²√2 ≈ 1.0595, about 6% higher. That is why our ears hear pitch in ratios, not in fixed steps of hertz.',
    ratio: [2, 1],
  },
  memory: {
    why: 'Your ear keeps a short "echo" of what you heard for 2–4 seconds (echoic memory). Humming the note turns it into a movement of your voice, which you can hold much longer. That is why singers remember starting notes so well.',
    math: 'A half step is about a 6% change in frequency; a quarter step about 3%. Decoys that close are hard to tell apart after a delay because memory blurs pitch over time.',
  },
  tuneup: {
    why: 'Two notes that are almost the same frequency interfere with each other: their waves line up, then cancel, then line up again. You hear this as a slow "wah-wah" wobble called beating. When the notes match perfectly, the wobble disappears. Musicians tune by listening for that wobble to stop.',
    math: 'The beat rate equals the difference between the frequencies: 440 Hz against 442 Hz beats 2 times per second. Distances are measured in cents: cents = 1200 × log₂(f₂ / f₁). 442 vs 440 Hz is about 7.9 cents; 100 cents make one half step.',
  },
  intervals: {
    why: 'Real notes are not single frequencies: each note also contains quieter overtones at 2×, 3×, 4×… its main frequency (the harmonic series). When two notes share many overtones, they blend and sound smooth. In an octave, every overtone of the upper note matches an overtone of the lower one, so it sounds like the "same" note, just higher.',
    math: 'Simple ratios sound smoothest: octave 2:1, fifth 3:2, fourth 4:3, major third 5:4, minor third 6:5. Modern tuning (equal temperament) uses 2^(n/12) instead: a fifth is 2^(7/12) ≈ 1.498, almost exactly 3:2.',
    ratio: [3, 2],
  },
  compare: {
    why: 'We hear interval size as a ratio between frequencies, not a difference in hertz. That is why a fifth sounds the same size whether it starts on a low note or a high one.',
    math: 'Interval size in half steps = 12 × log₂(f₂ / f₁). From 220 to 330 Hz and from 440 to 660 Hz are both a ratio of 1.5: the same perfect fifth (7 half steps).',
    ratio: [3, 2],
  },
  harmonic: {
    why: 'Played together, two notes either line up their overtones (smooth: octave, fifth) or put overtones very close together. Close overtones beat quickly, and fast beating sounds rough. That roughness is what we call dissonance: the "buzz" of a second or seventh.',
    math: 'Consonant: 2:1, 3:2, 4:3, 5:4. A minor second is 16:15 (6% apart), so many overtones nearly collide. The tritone in equal tuning is 2^(6/12) = √2 ≈ 1.414, which has no simple ratio at all: that is why it sounds restless.',
    ratio: [5, 4],
  },
  degrees: {
    why: 'After hearing lots of music, your brain learns which notes are stable in a key. The tonic (1) feels like home. 5 shares many overtones with 1 (a 3:2 fifth), so it feels strong. 7 sits only a half step below home, so it pulls upward. The tension and pull you feel are expectations your brain has learned.',
    math: 'The major scale is the pattern of steps W-W-H-W-W-W-H (2,2,1,2,2,2,1 half steps). The only half steps are 3→4 and 7→8, which is why 4 leans down to 3 and 7 leans up to 8.',
  },
  mood: {
    why: 'A major chord matches the natural overtone series: overtones 4, 5 and 6 of one note form a major triad, so it fuses into a bright, settled sound. The minor third is a slightly smaller, more complex ratio, so it sounds darker. Culture also teaches us to link minor with sadness, but the acoustic difference is real.',
    math: 'Major third: 4 half steps, about 5:4. Minor third: 3 half steps, about 6:5. A major triad is 4:5:6; a minor triad is 10:12:15, a more complex ratio.',
    ratio: [5, 4],
  },
  scales: {
    why: 'Stack perfect fifths (C, G, D, A, E, B, F♯…) and you get the notes of our scales: five fifths give the pentatonic, seven give the major scale. A mode uses the same notes but a different home note, so the pattern of steps around home changes, and so does the mood.',
    math: 'Equal temperament divides the octave into 12 equal ratios of 2^(1/12). Major: 2-2-1-2-2-2-1. Natural minor: 2-1-2-2-1-2-2. Dorian: 2-1-2-2-2-1-2. Whole tone: 2-2-2-2-2-2. Pentatonic: 2-2-3-2-3 (no half steps).',
  },
  contour: {
    why: 'The brain groups notes into lines (a "Gestalt"), and remembers the shape of the line long before the exact notes. Even babies recognize a melody\'s contour when it is transposed. That is why contour is the first thing to train.',
    math: 'A contour is the list of directions between notes. With n notes there are n − 1 moves, each up or down, so 2^(n−1) contours: 3 notes have 4, 5 notes have 16.',
  },
  motion: {
    why: 'Small steps sound connected into one line. Big leaps can make the ear split notes into separate "streams", as if two voices were playing. That is why easy-to-sing melodies move mostly by step.',
    math: 'Step: 1–2 half steps (ratio ≤ 1.12). Skip: 3–4 half steps. Leap: 5 or more half steps (a fourth, ratio 4:3, or wider).',
  },
  spot: {
    why: 'Working memory holds only about four "chunks" at once. Grouping notes into small chunks lets you remember longer tunes. When a note changes, the brain flags a surprise (a "mismatch" signal) even before you consciously notice.',
    math: '7 notes split as 3 + 4 make 2 chunks instead of 7 items. A one-half-step change is about a 6% frequency shift.',
  },
  chords: {
    why: 'A major chord lines up with the overtone series (overtones 4:5:6), so it fuses and feels stable. A diminished chord stacks two small thirds and contains a tritone, so it feels tense. An augmented chord stacks two equal major thirds; it is perfectly symmetrical, with no clear home, so it feels floating.',
    math: 'In half steps from the root: major 0-4-7, minor 0-3-7, diminished 0-3-6, augmented 0-4-8. A dominant 7th 0-4-7-10 sits close to the overtone ratio 4:5:6:7.',
    ratio: [6, 5, 4],
  },
  count: {
    why: 'Consonant notes fuse into one sound, which makes them hard to count. Your ear separates notes more easily when they are spread out, played by different instruments, or slightly out of sync.',
    math: 'A chord of n notes contains n(n−1)/2 intervals: 3 notes make 3 intervals, 4 notes 6, 5 notes 10. More intervals means a richer sound.',
  },
  progressions: {
    why: 'Chords that share notes move smoothly from one to the next. The V chord contains 7, the leading tone, a half step below home, so V pulls hard back to I. Roots falling by a fifth (V→I, ii→V) are the strongest moves in Western harmony.',
    math: 'V→I: the root falls a fifth (3:2). I, IV and V together contain all 7 notes of the major scale, which is why so many songs need only these three chords.',
  },
  cadences: {
    why: 'Tension and release: the V7 chord contains a tritone (between 7 and 4) that wants to collapse inward to 1 and 3. When it does (authentic cadence), you feel a full stop. Stopping on V (half cadence) leaves the tension hanging.',
    math: 'In C major, V7 = G-B-D-F. B and F are a tritone apart (6 half steps); they move to C and E, a major third (4 half steps). That narrowing is the "release".',
  },
  rhythm: {
    why: 'Your brain syncs its own rhythms to the beat, a process called entrainment. It predicts when the next beat will come. Syncopation puts notes where you did not predict them, and that small surprise is what makes music groove.',
    math: 'A quarter note splits into 2 eighths, 4 sixteenths, or 3 triplets. At 120 BPM a beat lasts 0.5 s, an eighth 0.25 s, a sixteenth 0.125 s.',
  },
  tempo: {
    why: 'People notice a tempo change of about 4–6%, the same proportion whether the music is fast or slow (this is known as Weber\'s law). That is why tiny speed-ups sound obvious in slow music and hide in fast music.',
    math: 'Beat length = 60 / BPM seconds. 120 BPM → 0.5 s per beat. A 6% change at 120 BPM is about 7 BPM.',
  },
  meter: {
    why: 'Your brain naturally groups beats in twos or threes. Accents, longer notes and bass notes mark the first beat of each group. Count from one strong beat to the next and you have found the meter.',
    math: '3/4 = 3 quarter-note beats. 6/8 = 6 eighth notes grouped 3 + 3 (two big beats). 7/8 = 2 + 2 + 3. At the same eighth-note speed, 3/4 and 6/8 both last 6 eighths, but group them differently.',
  },
  timbre: {
    why: 'Two instruments on the same note have the same main frequency but different overtone recipes, and different attacks (how the sound starts). The attack is the biggest clue: cut it off and even experts confuse instruments.',
    math: 'A clarinet\'s low notes contain mostly odd overtones (1, 3, 5…), which sounds hollow. A violin\'s bowed string gives all overtones with strength roughly 1/n, which sounds bright. A flute is close to a pure wave, so it sounds pure.',
    ratio: [3, 1],
  },
  families: {
    why: 'How an instrument makes sound decides its color. Bowing or blowing keeps feeding energy (the sound sustains). Plucking or striking gives one kick (the sound fades). Reeds and buzzing lips create many strong overtones (rich, brassy).',
    math: 'A string\'s frequency is f = (1 / 2L) × √(T / μ): shorter, tighter or lighter strings sound higher. In brass, playing louder strengthens high overtones, which is why loud brass sounds "brassy".',
  },
  expression: {
    why: 'We hear loudness on a log scale, so a crescendo must grow a lot in energy to sound evenly louder. Short notes with silence (staccato) feel light; connected notes (legato) feel singing. Slowing down at the end of a phrase is like a speaker pausing at a full stop.',
    math: 'Sound level in decibels: dB = 20 × log₁₀(A₂ / A₁). +6 dB doubles the amplitude; about +10 dB is heard as "twice as loud".',
  },
  notes: {
    why: 'A staff is a graph: time runs left to right, pitch goes up the page. The clef pins one line to one note: the treble clef curls around G4, the bass clef\'s dots surround F3. Everything else is counted from there.',
    math: 'Each line or space is one letter step. The seven letters A–G repeat every octave, and each octave doubles the frequency. Middle C ≈ 261.6 Hz; the treble clef\'s G4 ≈ 392 Hz.',
  },
  intreader: {
    why: 'The interval number is just the distance between the notes on the page, counting both notes. Your eyes measure it the way your ears measure the jump.',
    math: 'Interval number = (difference in line/space positions) + 1. Odd numbers (3rd, 5th, 7th) go line-to-line or space-to-space; even numbers go line-to-space.',
  },
  keysigs: {
    why: 'Every major key uses the same step pattern (W-W-H-W-W-W-H) starting on a different note. Starting a fifth higher (C → G) breaks the pattern in one place, which one sharp fixes (F♯). Each fifth higher needs one more sharp: that chain is the circle of fifths.',
    math: 'Twelve fifths (3:2 each) almost return to the starting note seven octaves up: (3/2)¹² ≈ 129.75 vs 2⁷ = 128. That tiny 1.4% gap, the Pythagorean comma, is why modern tuning slightly narrows every fifth.',
  },
}
