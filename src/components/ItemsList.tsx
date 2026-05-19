import React, { useEffect } from 'react';
import { Item } from '../types';
import './shared.css';
import './ItemsList.css';

const agruparPorCategoria = (items: Item[]): Record<string, Item[]> => {
  return items.reduce((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, Item[]>);
};

const pesoTotal = (items: Item[]): number => {
  return items.reduce((total, item) => total + item.peso * item.cantidad, 0);
};

type ItemsListProps = {
  items: Item[];
  jugador: string;
  onToggleEquipped?: (characterItemId: number, currentEquipped: boolean) => void;
};

export const ItemsList: React.FC<ItemsListProps> = ({ items, jugador, onToggleEquipped }) => {
  useEffect(() => {
    console.debug('ItemsList props - items count:', items.length, 'jugador:', jugador)
  }, [items, jugador])
  const itemsPorCategoria = agruparPorCategoria(items);
  const categorias = Object.keys(itemsPorCategoria).sort();
  const pesoInventario = pesoTotal(items);

  return (
    <div className="list-container items-list">
      <h2>{jugador} ({pesoInventario}kg)</h2>
      <hr className="solid" />
      <div className="items-por-categoria">
        {categorias.map((categoria) => (
          <div key={categoria} className="categoria-grupo">
            <h3 className="categoria-titulo">{categoria}</h3>
            <ul>
              {itemsPorCategoria[categoria].map((item) => (
                <li key={item.character_item_id || item.id} className={`item${item.is_equipped ? ' equipped' : ''}`}>
                  <span className="item-name">{item.nombre}</span>
                  <span className="cantidad">x{item.cantidad}</span>
                  <span className="peso">{item.peso}kg</span>
                  <span className="valor">${item.valor}</span>
                  {item.character_item_id && onToggleEquipped && (
                    <button
                      className="equip-button"
                      onClick={() => onToggleEquipped(item.character_item_id!, item.is_equipped ?? false)}
                      title={item.is_equipped ? 'Desmontar' : 'Equipar'}
                    >
                      {item.is_equipped ? '✓' : '◯'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
