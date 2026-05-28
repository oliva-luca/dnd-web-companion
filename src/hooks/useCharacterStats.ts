import { useEffect, useState, useCallback } from 'react'

export interface SpellLevelSlots {
  max: number
  used: number
}

export interface CharacterStats {
  maxHp: number
  currentHp: number
  spellSlots: Record<number, SpellLevelSlots>
}

export const SPELL_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

const emptySlots = (): Record<number, SpellLevelSlots> =>
  SPELL_LEVELS.reduce((acc, lvl) => {
    acc[lvl] = { max: 0, used: 0 }
    return acc
  }, {} as Record<number, SpellLevelSlots>)

const defaultStats = (): CharacterStats => ({
  maxHp: 10,
  currentHp: 10,
  spellSlots: emptySlots(),
})

// Placeholder persistence: stored per character in localStorage until the
// Supabase columns (max_hp, current_hp, ...) exist. Swapping to the DB later
// only requires changing load/persist here.
const storageKey = (characterId: number) => `character_stats_${characterId}`

function loadStats(characterId: number): CharacterStats {
  try {
    const raw = localStorage.getItem(storageKey(characterId))
    if (!raw) return defaultStats()
    const parsed = JSON.parse(raw)
    const base = defaultStats()
    const maxHp = typeof parsed.maxHp === 'number' ? parsed.maxHp : base.maxHp
    return {
      maxHp,
      currentHp:
        typeof parsed.currentHp === 'number'
          ? clamp(parsed.currentHp, 0, maxHp)
          : base.currentHp,
      spellSlots: SPELL_LEVELS.reduce((acc, lvl) => {
        const s = parsed.spellSlots?.[lvl]
        const max = typeof s?.max === 'number' ? Math.max(0, s.max) : 0
        const used = typeof s?.used === 'number' ? clamp(s.used, 0, max) : 0
        acc[lvl] = { max, used }
        return acc
      }, {} as Record<number, SpellLevelSlots>),
    }
  } catch {
    return defaultStats()
  }
}

export function useCharacterStats(characterId: number) {
  const [stats, setStats] = useState<CharacterStats>(() =>
    loadStats(characterId),
  )

  useEffect(() => {
    setStats(loadStats(characterId))
  }, [characterId])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(characterId), JSON.stringify(stats))
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [characterId, stats])

  const setMaxHp = useCallback((value: number) => {
    setStats((prev) => {
      const maxHp = Math.max(0, Math.floor(value || 0))
      return { ...prev, maxHp, currentHp: clamp(prev.currentHp, 0, maxHp) }
    })
  }, [])

  const setCurrentHp = useCallback((value: number) => {
    setStats((prev) => ({
      ...prev,
      currentHp: clamp(Math.floor(value || 0), 0, prev.maxHp),
    }))
  }, [])

  const adjustCurrentHp = useCallback((delta: number) => {
    setStats((prev) => ({
      ...prev,
      currentHp: clamp(prev.currentHp + delta, 0, prev.maxHp),
    }))
  }, [])

  const setSlotMax = useCallback((level: number, value: number) => {
    setStats((prev) => {
      const max = Math.max(0, Math.floor(value || 0))
      const used = clamp(prev.spellSlots[level]?.used ?? 0, 0, max)
      return {
        ...prev,
        spellSlots: { ...prev.spellSlots, [level]: { max, used } },
      }
    })
  }, [])

  const useSlot = useCallback((level: number) => {
    setStats((prev) => {
      const s = prev.spellSlots[level]
      if (!s || s.used >= s.max) return prev
      return {
        ...prev,
        spellSlots: { ...prev.spellSlots, [level]: { ...s, used: s.used + 1 } },
      }
    })
  }, [])

  const restoreSlot = useCallback((level: number) => {
    setStats((prev) => {
      const s = prev.spellSlots[level]
      if (!s || s.used <= 0) return prev
      return {
        ...prev,
        spellSlots: { ...prev.spellSlots, [level]: { ...s, used: s.used - 1 } },
      }
    })
  }, [])

  const longRest = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      currentHp: prev.maxHp,
      spellSlots: SPELL_LEVELS.reduce((acc, lvl) => {
        acc[lvl] = { max: prev.spellSlots[lvl]?.max ?? 0, used: 0 }
        return acc
      }, {} as Record<number, SpellLevelSlots>),
    }))
  }, [])

  return {
    stats,
    setMaxHp,
    setCurrentHp,
    adjustCurrentHp,
    setSlotMax,
    useSlot,
    restoreSlot,
    longRest,
  }
}
