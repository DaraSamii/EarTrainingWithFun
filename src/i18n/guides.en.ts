// Lesson cards shown in Learn before the sound demos (user feedback 0.7.0: "more explanation").
// what: the idea · listen: three listening tips (one per level, rotating) · watch: a common mistake · real: where you hear it
type Guide = { what: string; listen: [string, string, string]; watch: string; real: string }

export const guides: Record<string, Guide> = {
  pitch: {
    what: 'Every sound vibrates. Faster vibration means a higher pitch, slower means lower. Comparing two pitches is the most basic skill in ear training: every other skill is built on it.',
    listen: ['Hum both notes quietly. Did your voice go up or down?', 'Picture the notes as steps on a staircase: is the second one on a higher step?', 'Ignore loudness and instrument; only the height of the note matters.'],
    watch: 'Louder or brighter is not the same as higher. A loud low note is still low.',
    real: 'Singers tune to each other this way, and violinists check each note against the one before.',
  },
  memory: {
    what: 'Pitch memory is holding a note in your head after it stops. Musicians use it every time they sing back a melody or tune an instrument without a reference.',
    listen: ['Hum the first note silently and keep humming while the choices play.', 'Compare each choice with the note in your head, not with each other.', 'If two choices sound close, the one that feels "at rest" with your hummed note is the twin.'],
    watch: 'Do not pick the first choice that sounds nice: wait to hear all three.',
    real: 'Choir singers keep their starting note in mind through a whole piece without a piano.',
  },
  tuneup: {
    what: 'Tuning is hearing tiny differences in pitch. "Sharp" means slightly too high, "flat" slightly too low. Musicians measure these differences in cents: 100 cents make one half step.',
    listen: ['Out-of-tune notes often sound like they "wobble" or rub against each other.', 'Ask: did the second note sag (flat) or push (sharp)?', 'In tune feels calm and steady, like the two notes melt into one.'],
    watch: 'Very small differences can sound like "the same". Replay as often as you like.',
    real: 'Guitarists and string players tune before every performance, and singers adjust constantly.',
  },
  intervals: {
    what: 'An interval is the distance between two notes. Every interval has its own color: an octave sounds hollow and complete, a fifth open and strong, a third sweet.',
    listen: ['Sing or hum from the first note to the second: how big did your voice jump?', 'Use the song openings on the cards: they are hooks for your memory.', 'Listen to the feeling, not just the size: open, sweet, bold or tense.'],
    watch: 'Downward intervals feel different from upward ones. Practice both directions.',
    real: 'Melodies are built from intervals; knowing them lets you play songs by ear.',
  },
  compare: {
    what: 'Comparing interval sizes trains your sense of distance between notes, even when the intervals start on different notes.',
    listen: ['Forget how high each pair is; only the stretch between its two notes counts.', 'Hum each jump. Which one made your voice travel further?', 'When sizes are close, imagine counting piano keys between the notes.'],
    watch: 'A pair played higher is not automatically bigger.',
    real: 'Arrangers compare intervals constantly when writing harmony parts.',
  },
  harmonic: {
    what: 'When two notes sound at the same time, they form a harmonic interval. Instead of a jump you hear a blend: smooth, open, sweet or clashing.',
    listen: ['Listen for the blend: does it feel smooth and settled, or does it buzz?', 'Octaves and fifths sound empty and pure; thirds and sixths sound sweet and full.', 'Seconds and sevenths rub; the tritone sounds restless.'],
    watch: 'Do not try to hear the notes separately at first; judge the overall color.',
    real: 'Every chord is made of harmonic intervals; guitar "power chords" are fifths.',
  },
  degrees: {
    what: 'In a key, one note feels like home: the tonic (1, Do). Every other note has a feeling relative to home: some are stable, some lean and want to move. This is called functional hearing.',
    listen: ['Always listen to the key (the chords) first: it sets up home.', 'Ask how the note feels: finished, bright, leaning, or tense?', 'Imagine singing from the note back down (or up) to home: the resolution tells you where you were.'],
    watch: 'Do not try to recognize the exact pitch: the same degree sounds the same in every key.',
    real: 'Musicians who play by ear think in degrees: "the melody starts on 5 and falls to 1".',
  },
  mood: {
    what: 'Major and minor keys use different scales. The biggest difference is the third note: raised in major (bright), lowered in minor (darker).',
    listen: ['Bright, open and sunny usually means major.', 'Serious, sad or mysterious usually means minor.', 'Focus on the third note of the scale: it carries the mood.'],
    watch: 'Fast music can still be minor, and slow music can be major. Listen to the notes, not the speed.',
    real: '"Happy Birthday" is major; many film themes for tense scenes are minor.',
  },
  scales: {
    what: 'A scale is a set of notes in order, like a ladder. Each scale has its own pattern of big and small steps, and that pattern gives it its mood.',
    listen: ['Listen to the 3rd note: high = major family, low = minor family.', 'Notice anything unusual: a big jump, a raised 4th, a lowered 2nd.', 'Pentatonic has only five notes and no small half steps: it sounds open.'],
    watch: 'Modes can sound almost like major or minor; one special note gives them away.',
    real: 'Blues uses the blues scale, folk the pentatonic, Spanish flamenco the Phrygian mode.',
  },
  contour: {
    what: 'Contour is the shape of a melody: up, down, arch or valley. It is the first thing we remember about a tune, long before the exact notes.',
    listen: ['Draw the melody in the air with your finger as it plays.', 'Only care about direction: up, down, or turning around.', 'Longer tunes: split them into two halves and follow each.'],
    watch: 'Big jumps and small steps can make the same shape.',
    real: 'Composers use rising contours for excitement and falling ones for calm endings.',
  },
  motion: {
    what: 'Melodies move in four ways: repeat a note, step to the next note, skip over one, or leap far. Knowing the move is the first step to writing down a melody.',
    listen: ['Step: your voice barely moves. Leap: it really has to jump.', 'A skip sounds like the first two notes of a chord.', 'With a tune before it, focus only on the very last move.'],
    watch: 'Direction does not matter here, only the size of the move.',
    real: 'Singable melodies are mostly steps with a few leaps for drama.',
  },
  spot: {
    what: 'Melodic memory: remember a melody well enough to notice when one note changes. It is the foundation for playing back and writing down melodies.',
    listen: ['Hum along silently the first time.', 'Chunk long tunes into small groups of 2–3 notes.', 'When the change happens, it often feels like a "bump" in the tune.'],
    watch: 'Do not wait until the end: the moment of change is the clue.',
    real: 'Musicians spot wrong notes instantly in rehearsals this way.',
  },
  chords: {
    what: 'A chord is three or more notes played together. The quality of a chord (major, minor, diminished, augmented, sevenths) gives it a color and a feeling.',
    listen: ['Major sounds bright and stable, minor darker.', 'Diminished sounds squeezed and tense, augmented stretched and dreamy.', 'Sevenths add a fourth note: jazzy, bluesy or mellow.'],
    watch: 'Do not count notes; hear the overall mood of the chord.',
    real: 'Most songs mix major and minor chords; jazz loves seventh chords.',
  },
  count: {
    what: 'Counting notes in a chord trains your ear to hear inside a sound, not just its overall color.',
    listen: ['Listen from the lowest note upward.', 'More notes usually sound thicker and richer.', 'Spread-out chords hide notes: listen for the top and bottom first.'],
    watch: 'Two notes an octave apart can sound like one.',
    real: 'Arrangers and producers listen this way to balance a mix.',
  },
  progressions: {
    what: 'Chords move from one to the next in patterns called progressions. Roman numerals name each chord by the scale note it starts on: I is home, IV the 4th, V the 5th.',
    listen: ['Follow the bass note: where does it go?', 'V pulls strongly back to I; IV feels like a gentle lift.', 'vi is the minor chord: it adds a sad touch.'],
    watch: 'Many pop songs use the same four chords in different orders. Focus on the order.',
    real: '"I–V–vi–IV" is the backbone of countless pop songs.',
  },
  cadences: {
    what: 'A cadence is how a musical phrase ends, like punctuation. Authentic is a full stop, half a comma, plagal a soft "amen", deceptive a surprise.',
    listen: ['Listen to the last two chords only.', 'Does the phrase feel finished (authentic, plagal) or hanging (half)?', 'A deceptive cadence expects home but lands somewhere sad.'],
    watch: 'Plagal and authentic both end at home: listen to the chord just before it.',
    real: 'Hymns end with "Amen" (plagal); pop songs often end verses on a half cadence.',
  },
  rhythm: {
    what: 'Rhythm is when notes happen in time. A grid of boxes shows a bar: each box is a short slice of time, and filled boxes are notes.',
    listen: ['Count along with the clicks: "1 2 3 4".', 'Tap the rhythm with your finger while it plays.', 'Compare the grids beat by beat, not all at once.'],
    watch: 'Two rhythms can have the same number of notes in different places.',
    real: 'Drummers, dancers and rappers all think in these grids.',
  },
  tempo: {
    what: 'Tempo is the speed of the beat. Keeping a steady tempo, and noticing when it changes, is essential for playing with others.',
    listen: ['Tap along with the first bar, then keep tapping.', 'If the second bar runs ahead of your taps, it got faster.', 'If it falls behind, it got slower.'],
    watch: 'Busier drum patterns can feel faster without the tempo changing.',
    real: 'Bands rush when excited and drag when tired; good musicians hear it.',
  },
  meter: {
    what: 'Meter groups beats into bars. The first beat of each bar is strongest. 3/4 counts in threes (waltz), 4/4 in fours, 6/8 in two big beats split into threes.',
    listen: ['Find the strongest beat, then count until it comes back.', 'Feel whether the beat sways in 2 or turns in 3.', 'Odd meters like 5/4 and 7/8 feel uneven, like a limp.'],
    watch: '3/4 and 6/8 both have six eighth notes per bar: listen to how they group.',
    real: 'Waltzes are in 3/4, most pop in 4/4, many folk dances in 6/8.',
  },
  timbre: {
    what: 'Timbre is the color of a sound: why a violin and a flute sound different even on the same note.',
    listen: ['Listen to how each note starts: plucked, bowed, blown or struck.', 'Does the note fade away or sustain?', 'Is the tone breathy, buzzy, bright or warm?'],
    watch: 'Instruments sound different in different ranges; a low flute can surprise you.',
    real: 'Orchestrators choose instruments for their timbre the way painters choose colors.',
  },
  families: {
    what: 'Instruments are grouped into families by how they make sound: bowed strings, woodwinds (breath), brass (buzzing lips), keyboards, plucked strings, and mallets.',
    listen: ['Bowed strings sustain smoothly; plucked strings fade.', 'Woodwinds sound breathy or reedy; brass sounds bright and buzzy.', 'Mallets and keyboards start with a strike.'],
    watch: 'A saxophone is metal but belongs to the woodwinds: it uses a reed.',
    real: 'Orchestras seat players by family: strings in front, winds and brass behind.',
  },
  expression: {
    what: 'Expression is how music is played: loud or soft (dynamics), short or smooth (articulation), faster or slower (tempo changes).',
    listen: ['Dynamics: is the volume growing, fading, or steady?', 'Articulation: are there tiny gaps between notes (staccato)?', 'Tempo: do the notes crowd together or spread apart?'],
    watch: 'Listen to the change over time, not just the loudness of one note.',
    real: 'The same melody can feel joyful or sad just by changing its expression.',
  },
  notes: {
    what: 'Notes are written on a staff of five lines. The clef tells you which lines are which notes. Reading notes connects what you see to what you hear.',
    listen: ['Learn a few landmark notes first, then count steps from them.', 'Each line-to-space step is the next letter.', 'After answering, listen to the note: link the picture to the sound.'],
    watch: 'Treble and bass clefs name the lines differently. Check the clef first.',
    real: 'Every printed piece of music uses this system.',
  },
  intreader: {
    what: 'Reading intervals means counting the letter distance between two written notes, counting both notes.',
    listen: ['Line to the next space is a 2nd; line to the next line is a 3rd.', 'Odd intervals (3rd, 5th, 7th) go line-to-line or space-to-space.', 'After answering, listen: does the sound match the picture?'],
    watch: 'Count both notes: from C up to E is a 3rd (C, D, E), not a 2nd.',
    real: 'Sight-singers read intervals to find the next note without a piano.',
  },
  keysigs: {
    what: 'A key signature is the group of sharps or flats at the start of each staff line. It tells you the key and which notes are always sharp or flat.',
    listen: ['Sharps: the last sharp is the 7th note; go up a half step to find the key.', 'Flats: the second-to-last flat is the key.', 'Every signature also has a relative minor, three half steps below the major key.'],
    watch: 'One flat (F major) and no sharps or flats (C major) must simply be remembered.',
    real: 'Reading the key signature first tells you the "home" of the whole piece.',
  },
}
