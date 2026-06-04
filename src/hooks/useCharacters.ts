import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { Jugador, CharacterItem } from '../types';

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
        `id, name, class, level, public, character_items(id, count, is_equipped, public, notes, items(id, name, weight, value, category, description))`
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
        const inventario: CharacterItem[] = (c.character_items || []).map((ci: any) => ({
          id: ci.id,
          character_id: c.id,
          item_id: ci.items?.id,
          count: ci.count ?? 1,
          is_equipped: ci.is_equipped ?? false,
          public: ci.public ?? true,
          notes: ci.notes,
          item: {
            id: ci.items?.id,
            name: ci.items?.name ?? 'Unknown',
            weight: ci.items?.weight ?? 0,
            value: ci.items?.value ?? 0,
            category: ci.items?.category ?? 'Misc',
            description: ci.items?.description,
          }
        }))

        return {
          id: c.id,
          nombre: c.name,
          class: c.class,
          level: c.level,
          public: c.public,
          inventario,
        }
      })

      // --- Custom Logic ---
      const mundo = mapped.find(c => c.nombre === 'Mundo');
      if (mundo) {
        localStorage.setItem('dungeon_master', mundo.id.toString());
      }

      const otherCharacters = mapped.filter(c => c.nombre !== 'Mundo');
      const publicItems = mapped
        .filter(c => c.nombre !== 'Mundo')
        .flatMap(c => c.inventario)
        .filter(item => item.public);

      const party: Jugador = {
        id: 0,
        nombre: 'Party',
        inventario: publicItems,
        public: true,
      };

      const finalCharacters = [party, ...otherCharacters];
      if (mundo) {
        finalCharacters.push(mundo);
      }
      // --- End Custom Logic ---

      console.debug('Mapped characters:', finalCharacters)
      setCharacters(finalCharacters)
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

  const createOptimisticUpdater = <T>(
    updateFn: (item: CharacterItem, _value: T) => CharacterItem,
    // loosened return type to allow supabase's builder-like return type without TS errors
    dbUpdate: (characterItemId: number, value: T) => any,
  ) => {
    return async (characterItemId: number, value: T) => {
      const originalCharacters = characters;

      // Optimistically update local state
      setCharacters((prev) =>
        prev.map((c) => ({
          ...c,
          inventario: c.inventario.map((item) =>
            item.id === characterItemId
              ? updateFn(item, value)
              : item,
          ),
        })),
      );

      try {
        const { error } = await dbUpdate(characterItemId, value);
        if (error) {
          console.error('Error updating item:', error);
          setCharacters(originalCharacters); // Revert on error
        }
      } catch (e) {
        console.error('Exception updating item:', e);
        setCharacters(originalCharacters); // Revert on exception
      }
    };
  };

  const toggleItemEquipped = createOptimisticUpdater(
    (item, _value) => ({ ...item, is_equipped: !item.is_equipped }),
    (id, value) =>
      supabase
        .from('character_items')
        .update({ is_equipped: !value })
        .eq('id', id),
  );

  const toggleItemPublic = createOptimisticUpdater(
    (item, _value) => ({ ...item, public: !item.public }),
    (id, value) =>
      supabase.from('character_items').update({ public: !value }).eq('id', id),
  );

  const updateItemNotes = createOptimisticUpdater(
    (item, value) => ({ ...item, notes: value as string }),
    (id, value) =>
      supabase.from('character_items').update({ notes: value }).eq('id', id),
  );

  const createCharacter = async (name: string, characterClass: number, level: number) => {
    const { error } = await supabase
      .from('characters')
      .insert([{ name, class: characterClass, level, campaign_id: campaignId }]);

    if (error) {
      console.error('Error creating character:', error);
      setError(error);
    } else {
      fetchData();
    }
  };
  
  const createCharacterItem = async (characterItem: Omit<CharacterItem, 'id'| 'item'>) => {
      const { data, error } = await supabase
        .from('character_items')
        .insert(characterItem)
        .select();
      if (error) {
        throw new Error(error.message);
      }
      return data[0];
    };

  const changeItemOwner = async (characterItemId: number, newOwnerId: number) => {
      const { error } = await supabase
        .from('character_items')
        .update({ character_id: newOwnerId })
        .eq('id', characterItemId);

      if (error) {
        console.error('Error updating item owner:', error);
        setError(error);
        throw error;
      }
      await fetchData();
  };

  const setNewItemCount = async (characterItemId: number, count: number) => {
    let result;
    if (count <= 0) {
        result = await supabase
            .from('character_items')
            .delete()
            .eq('id', characterItemId);
    } else {
        result = await supabase
          .from('character_items')
          .update({ count: count })
          .eq('id', characterItemId);
    }

    const { error } = result;

    if (error) {
      console.error('Error updating or deleting item count:', error);
      setError(error);
      throw error;
    }
    await fetchData();
  };

  const toggleCharacterPublic = async (id: number) => {
    const character = characters.find(c => c.id === id);
    if (!character) return;

    const { error } = await supabase
      .from('characters')
      .update({ public: !character.public })
      .eq('id', id);

    if (error) {
      console.error('Error toggling character public state:', error);
      setError(error);
    } else {
      await fetchData();
    }
  };

  return { characters, loading, error, reload: fetchData, toggleItemEquipped, toggleItemPublic, updateItemNotes, createCharacter, createCharacterItem, changeItemOwner, setNewItemCount, toggleCharacterPublic }
}