import React from 'react';
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

export const ItemsList: React.FC<{ items: Item[] }> = ({ items }) => {
  const itemsPorCategoria = agruparPorCategoria(items);
  const categorias = Object.keys(itemsPorCategoria).sort();

  return (
    <div className="list-container items-list">
      <h2>Objetos</h2>
      <div className="items-por-categoria">
        {categorias.map((categoria) => (
          <div key={categoria} className="categoria-grupo">
            <h3 className="categoria-titulo">{categoria}</h3>
            <ul>
              {itemsPorCategoria[categoria].map((item) => (
                <li key={item.id} className="item">
                  <div className="item-name">{item.nombre}</div>
                  <div className="item-details">
                    <span className="cantidad">x{item.cantidad}</span>
                    <span className="peso">Peso: {item.peso} kg</span>
                    <span className="valor">Valor: ${item.valor}</span>
                  </div>
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

