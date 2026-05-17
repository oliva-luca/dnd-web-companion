import React from 'react';
import ReactDOM from 'react-dom/client';
import ItemsList from './components/ItemsList';
import JugadoresList from './components/JugadoresList';
import { itemsMock, jugadoresMock } from './data';

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
