import { levelId, type Stage, type Unit } from '../../games/catalog'
import { useProgress } from '../../progress/store'
import { level as stats } from '../../progress/progress'
import { en } from '../../i18n/en'

/** Beginner / Intermediate / Advanced tabs, each with its progress, so a path never gets too long */
export function StageTabs({ units, stage, onChange }: { units: Unit[]; stage: Stage; onChange(s: Stage): void }) {
  const p = useProgress()
  return (
    <div className="stage-tabs" role="tablist">
      {([0, 1, 2] as Stage[]).map((s) => {
        const ids = units.filter((u) => u.stage === s).flatMap((u) => u.nodes.map(([g, l]) => levelId(g, l)))
        if (!ids.length) return null
        const done = ids.filter((id) => stats(p, id).done).length
        return (
          <button key={s} role="tab" aria-selected={stage === s} className={`stage-tab stage-${s}`} onClick={() => onChange(s)}>
            <strong>{en.stages[s]}</strong>
            <span className="meter"><i style={{ width: `${(done / ids.length) * 100}%` }} /></span>
            <small>{done}/{ids.length}</small>
          </button>
        )
      })}
    </div>
  )
}
