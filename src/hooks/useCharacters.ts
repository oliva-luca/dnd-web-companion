import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { Jugador, Item } from '../types'

export function useCharacters(campaignId = 1) {
  const [characters, setCharacters] = useState<Jugador[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('characters')
      .select(
        `id, name, class, level, character_items(id, count, is_equipped, public, notes, items(id, name, weight, value, category, description))`
      )
      .eq('campaign_id', campaignId)

    console.debug('Supabase raw response:', { data, error })

    if (error || !data) {
      const err = error || new Error('No data')
      console.error('Error fetching characters from Supabase:', err)
      setError(err)
      setLoading(false)
      return
    }

    try {
      const mapped: Jugador[] = (data as any[]).map((c) => {
        const inventario: Item[] = (c.character_items || []).map((ci: any) => ({
          id: ci.items?.id ?? ci.id,
          nombre: ci.items?.name ?? 'Unknown',
          cantidad: ci.count ?? 1,
          peso: ci.items?.weight ?? 0,
          valor: ci.items?.value ?? 0,
          categoria: ci.items?.category ?? 'Misc',
          is_equipped: ci.is_equipped ?? false,
          public: ci.public ?? true,
          character_item_id: ci.id,
          descripcion: ci.items.description,
          notas: ci.notes
        }))

        return {
          id: c.id,
          nombre: c.name,
          inventario,
        }
      })

      console.debug('Mapped characters:', mapped)
      setCharacters(mapped)
    } catch (e) {
      setError(e)
      console.error('Error mapping characters', e)
    }

    setLoading(false)
  }, [campaignId])

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    fetchData()
    return () => {
      mounted = false
    }
  }, [fetchData])

  const toggleItemEquipped = useCallback(async (characterItemId: number, currentEquipped: boolean) => {
    const newEquipped = !currentEquipped

    // Update in Supabase
    try {
      const { error } = await supabase
        .from('character_items')
        .update({ is_equipped: newEquipped })
        .eq('id', characterItemId)

      if (error) {
        console.error('Error updating equipped status:', error)
        // Revert by reloading
        fetchData()
        return
      }

      // Re-fetch to ensure consistency
      fetchData()
    } catch (e) {
      console.error('Error toggling equipped:', e)
      fetchData()
    }
  }, [fetchData])

  const toggleItemPublic = useCallback(async (characterItemId: number, currentPublic: boolean) => {
    const newPublic = !currentPublic

    // Update in Supabase
    try {
      const { error } = await supabase
        .from('character_items')
        .update({ public: newPublic })
        .eq('id', characterItemId)

      if (error) {
        console.error('Error updating public status:', error)
        // Revert by reloading
        fetchData()
        return
      }

      // Re-fetch to ensure consistency
      fetchData()
    } catch (e) {
      console.error('Error toggling public:', e)
      fetchData()
    }
  }, [fetchData])

  return { characters, loading, error, reload: fetchData, toggleItemEquipped, toggleItemPublic }
}

