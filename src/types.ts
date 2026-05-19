export interface Item {
  id: number;
  nombre: string;
  cantidad: number;
  peso: number;
  valor: number;
  categoria: string;
  is_equipped?: boolean;
  character_item_id?: number;
}

export interface Jugador {
  id: number;
  nombre: string;
  inventario: Item[];
}

