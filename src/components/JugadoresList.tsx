import React from 'react';
import { Jugador } from '../types';
import './shared.css';
import './JugadoresList.css';

const classIconos: Record<number, string> = {
  0: '', // '󰢊', // 'Artífice',
  1: '󱡂', // 'Bárbaro',
  2: '', // 'Bardo',
  3: '󱙧', // 'Brujo',
  4: '', // 'Clérigo',
  5: '󰏩', // 'Druida',
  6: '󱡁', // 'Explorador',
  7: '󰓥', // 'Guerrero',
  8: '', // 'Mago',
  9: '', // 'Monje',
  10: '󰳉', // 'Paladín',
  11: '󰴮',// 'Pícaro',
  12: '󰁨', // 'Hechicero',
  13: '',
  14: '󰴮',
};

type Props = {
  jugadores: Jugador[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export const JugadoresList: React.FC<Props> = ({
  jugadores,
  selectedId,
  onSelect,
}) => (
  <div className="list-container jugadores-list">
    <h2>Jugadores</h2>
    <ul>
      {jugadores.map((jugador) => (
        <li
          key={jugador.id}
          className={'jugador' + (selectedId === jugador.id ? ' selected' : '')}
          onClick={() => onSelect(jugador.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelect(jugador.id);
          }}
        >
          <div className="class-icon">
            <i className="nf" style={{ fontSize: 18, color: '#b58a14' }}>
              {classIconos[jugador.nombre == 'Mundo' ? 13 : jugador.class ?? 14] ||
                '󰴮'}
            </i>
          </div>
          {jugador.nombre}
        </li>
      ))}
    </ul>
  </div>
);

export default JugadoresList;
