import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { Item } from '../types'

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('items')
      .select(`id, name, weight, value, category, description`)

    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const createItem = async (item: Omit<Item, 'id'>) => {
    const { data, error } = await supabase.from('items').insert(item).select();
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  };

  return { items, loading, error, reload: fetchData, createItem }
}