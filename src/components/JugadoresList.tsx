import React from 'react';
import { Jugador } from '../types';
import './shared.css';
import './JugadoresList.css';

export const JugadoresList: React.FC<{ jugadores: Jugador[] }> = ({ jugadores }) => (
  <div className="list-container jugadores-list">
    <h2>Jugadores</h2>
    <ul>
      {jugadores.map((jugador) => (
        <li key={jugador.id} className="jugador">
          {jugador.nombre}
        </li>
      ))}
    </ul>
  </div>
);

export default JugadoresList;
