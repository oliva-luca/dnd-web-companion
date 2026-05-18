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

export const ItemsList: React.FC<{ items: Item[], jugador: string }> = ({ items, jugador }) => {
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
                <li key={item.id} className="item">
                  <span className="item-name">{item.nombre}</span>
                  <span className="cantidad">x{item.cantidad}</span>
                  <span className="peso">{item.peso}kg</span>
                  <span className="valor">${item.valor}</span>
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
