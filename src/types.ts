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
  nombre: string;
  cantidad: number;
  peso: number;
  valor: number;
  categoria: string;
  descripcion?: string;
  notas?: string;
  is_equipped?: boolean;
  public?: boolean;
  character_item_id?: number;
}

export interface Jugador {
  id: number;
  nombre: string;
  inventario: Item[];
}