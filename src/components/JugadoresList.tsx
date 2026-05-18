import React from 'react';
import { Jugador } from '../types';
import './shared.css';
import './JugadoresList.css';

type Props = {
  jugadores: Jugador[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export const JugadoresList: React.FC<Props> = ({ jugadores, selectedId, onSelect }) => (
  <div className="list-container jugadores-list">
    <h2>Jugadores</h2>
    <ul>
      {jugadores.map((jugador) => (
        <li
          key={jugador.id}
          className={"jugador" + (selectedId === jugador.id ? ' selected' : '')}
          onClick={() => onSelect(jugador.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelect(jugador.id);
          }}
        >
          {jugador.nombre}
        </li>
      ))}
    </ul>
  </div>
);

export default JugadoresList;
