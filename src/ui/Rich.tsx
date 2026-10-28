/**
 * Text with "textured" words (user feedback 0.8.0): words that describe a sound act it out.
 * "higher" climbs, "lower" sinks, "bigger" grows, "softer" fades, "staccato" hops apart…
 * Screen readers still read the plain word: letters are aria-hidden next to a visually hidden copy.
 */
const FX: Record<string, string> = {}
const add = (fx: string, words: string) => words.split(' ').forEach((w) => { FX[w] = fx })
add('up', 'higher highest rising rises climbs climb')
add('down', 'lower lowest sinks sink falls falling sags')
add('grow', 'bigger larger wider louder crescendo grows')
add('shrink', 'smaller tiny closer softer quieter decrescendo fades fading')
add('fast', 'faster quick speeds')
add('slow', 'slower slows')
add('bright', 'bright brighter sunny')
add('dark', 'dark darker sad')
add('tense', 'tense tension restless clashing clashes')
add('rough', 'rough buzz rubs wobble')
add('smooth', 'smooth sweet calm stable settled')
add('float', 'floating dreamy hollow')
add('hop', 'staccato')
add('glide', 'legato connected')

/** Effects drawn letter by letter */
const PER_LETTER = new Set(['up', 'down', 'grow', 'shrink', 'hop'])
const RE = new RegExp(`\\b(${Object.keys(FX).join('|')})\\b`, 'gi')

export function Rich({ text }: { text: string }) {
  const parts = text.split(RE)
  return <>{parts.map((p, i) => (i % 2 ? <Fx key={i} word={p} /> : p))}</>
}

function Fx({ word }: { word: string }) {
  const fx = FX[word.toLowerCase()]
  if (!PER_LETTER.has(fx)) return <span className={`fx fx-${fx}`}>{word}</span>
  const n = word.length
  return (
    <span className={`fx fx-${fx}`} style={{ '--n': n } as React.CSSProperties}>
      <span className="sr-only">{word}</span>
      {[...word].map((ch, i) => <span key={i} className="fx-l" aria-hidden="true" style={{ '--i': i } as React.CSSProperties}>{ch}</span>)}
    </span>
  )
}
