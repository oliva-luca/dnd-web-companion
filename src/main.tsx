import React from 'react';
import ReactDOM from 'react-dom/client';

// Tipos de datos
interface Item {
  id: number;
  nombre: string;
  peso: number;
  valor: number;
}

interface Jugador {
  id: number;
  nombre: string;
}

// Datos mockeados
const itemsMock: Item[] = [
  { id: 1, nombre: 'Espada de Fuego', peso: 5.2, valor: 500 },
  { id: 2, nombre: 'Escudo de Hielo', peso: 8.5, valor: 450 },
  { id: 3, nombre: 'Poción de Vida', peso: 0.5, valor: 100 },
  { id: 4, nombre: 'Gema Mágica', peso: 0.1, valor: 1000 },
  { id: 5, nombre: 'Botas Voladoras', peso: 2.0, valor: 750 },
];

const jugadoresMock: Jugador[] = [
  { id: 1, nombre: 'Aragorn' },
  { id: 2, nombre: 'Legolas' },
  { id: 3, nombre: 'Gimli' },
  { id: 4, nombre: 'Gandalf' },
  { id: 5, nombre: 'Frodo' },
];

// Componente para la lista de objetos
const ItemsList: React.FC<{ items: Item[] }> = ({ items }) => (
  <div className="list-container items-list">
    <h2>Objetos</h2>
    <ul>
      {items.map((item) => (
        <li key={item.id} className="item">
          <div className="item-name">{item.nombre}</div>
          <div className="item-details">
            <span className="peso">Peso: {item.peso} kg</span>
            <span className="valor">Valor: ${item.valor}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// Componente para la lista de jugadores
const JugadoresList: React.FC<{ jugadores: Jugador[] }> = ({ jugadores }) => (
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

// Componente principal
const App: React.FC = () => (
  <div className="app-container">
    <header className="app-header">
      <h1>Gestor de Inventario</h1>
    </header>
    <main className="app-main">
      <ItemsList items={itemsMock} />
      <JugadoresList jugadores={jugadoresMock} />
    </main>
  </div>
);

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

