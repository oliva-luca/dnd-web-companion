export enum CharacterClasses {
  'Artífice',
  'Bárbaro',
  'Bardo',
  'Brujo',
  'Clérigo',
  'Druida',
  'Explorador',
  'Guerrero',
  'Mago',
  'Monje',
  'Paladín',
  'Pícaro',
  'Hechicero',
}

export interface Item {
  id: number;
  name: string;
  weight: number;
  value: number;
  category: string;
  description?: string;
}

export interface CharacterItem {
  id: number;
  character_id: number;
  item_id: number;
  count: number;
  is_equipped: boolean;
  notes?: string;
  public: boolean;
  item: Item;
}


export interface Jugador {
  id: number;
  nombre: string;
  inventario: CharacterItem[];
  current_hp?: number;
  max_hp?: number;
}