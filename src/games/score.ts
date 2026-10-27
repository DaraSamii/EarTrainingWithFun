/** Combo multiplier: ×1 → ×1.5 at 3 in a row → ×2 at 6 → ×2.5 at 9 → ×3 cap */
export const multiplier = (combo: number) => Math.min(3, 1 + Math.floor(combo / 3) * 0.5)

/** First-try hit: 100 base + up to 100 speed bonus, times the combo multiplier */
export const points = (timeLeft: number, combo: number) =>
  Math.round((100 + 100 * Math.max(0, Math.min(1, timeLeft))) * multiplier(combo))

/** Correct only after a wrong try: still worth something, never multiplied */
export const LATE_POINTS = 25
