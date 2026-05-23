import { supabase } from '../supabaseClient';
import { Item } from '../types';

export const useItem = () => {
  const createItem = async (item: Omit<Item, 'id'>) => {
    const { data, error } = await supabase.from('items').insert(item).select();
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  };

  return { createItem };
};
