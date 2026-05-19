import React, { useEffect, useState } from 'react';
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
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="list-container items-list">
      <h2>{jugador} ({pesoInventario}kg)</h2>
      <hr className="solid" />
      <div className="items-por-categoria">
        {categorias.map((categoria) => (
          <div key={categoria} className="categoria-grupo">
            <h3 className="categoria-titulo">{categoria}</h3>
            <ul>
              {itemsPorCategoria[categoria].map((item) => {
                const idKey = item.character_item_id || item.id;
                const menuOpen = openMenuId === idKey;
                return (
                  <li key={idKey} className={`item${item.is_equipped ? ' equipped' : ''}`}>
                    <div className="item-main">
                      <span className="item-name">{item.nombre}</span>
                      <span className="cantidad">x{item.cantidad}</span>
                      <span className="peso">{item.peso}kg</span>
                      <span className="valor">${item.valor}</span>
                      {item.character_item_id && onToggleEquipped && (
                        <button
                          className="menu-button"
                          onClick={() => setOpenMenuId(menuOpen ? null : idKey)}
                          aria-expanded={menuOpen}
                          aria-controls={`menu-${idKey}`}
                          title={menuOpen ? 'Close' : 'Options'}
                        >
                          ⋮
                        </button>
                      )}
                    </div>

                    {menuOpen && (
                      <div className="item-menu" id={`menu-${idKey}`}>
                        <button
                          className="equip-action"
                          onClick={async () => {
                            if (item.character_item_id && onToggleEquipped) {
                              await onToggleEquipped(item.character_item_id, item.is_equipped ?? false);
                              setOpenMenuId(null);
                            }
                          }}
                        >
                          {item.is_equipped ? 'Unequip' : 'Equip'}
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
