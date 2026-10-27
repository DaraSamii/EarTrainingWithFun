import { levelId, type Stage, type Unit } from '../../games/catalog'
import { useProgress } from '../../progress/store'
import { level as stats } from '../../progress/progress'
import { en } from '../../i18n/en'

/** Beginner / Intermediate / Advanced tabs; a highlight slides to the chosen tab (user feedback 0.6.0) */
export function StageTabs({ units, stage, onChange }: { units: Unit[]; stage: Stage; onChange(s: Stage): void }) {
  const p = useProgress()
  const stages = ([0, 1, 2] as Stage[]).filter((s) => units.some((u) => u.stage === s))
  const at = Math.max(0, stages.indexOf(stage))
  return (
    <div className="stage-tabs" role="tablist" style={{ '--n': stages.length, '--i': at } as React.CSSProperties}>
      <span className={`stage-slider stage-bg-${stage}`} aria-hidden="true" />
      {stages.map((s) => {
        const ids = units.filter((u) => u.stage === s).flatMap((u) => u.nodes.map(([g, l]) => levelId(g, l)))
        const done = ids.filter((id) => stats(p, id).done).length
        return (
          <button key={s} role="tab" aria-selected={stage === s} className="stage-tab" onClick={() => onChange(s)}
            onKeyDown={(e) => {
              // arrows move between tabs when a tab has focus
              const k = stages.indexOf(s) + (e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0)
              if (k !== stages.indexOf(s) && stages[k] !== undefined) { e.preventDefault(); onChange(stages[k]) }
            }}>
            <strong>{en.stages[s]}</strong>
            <span className="meter"><i style={{ width: `${(done / ids.length) * 100}%` }} /></span>
            <small>{done}/{ids.length}</small>
          </button>
        )
      })}
    </div>
  )
}
