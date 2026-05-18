import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ItemsList from './components/ItemsList';
import JugadoresList from './components/JugadoresList';
import { jugadoresMock } from './data';

const App: React.FC = () => {
  const [selectedJugadorId, setSelectedJugadorId] = useState<number | null>(
    jugadoresMock.length > 0 ? jugadoresMock[0].id : null
  );

  const jugadorSeleccionado = jugadoresMock.find((j) => j.id === selectedJugadorId) || null;

  return (
    <div className="app-container">
      <main className="app-main">
        <ItemsList items={jugadorSeleccionado ? jugadorSeleccionado.inventario : []} jugador={jugadorSeleccionado ? jugadorSeleccionado.nombre : 'Seleccionar jugador'} />
        <JugadoresList
          jugadores={jugadoresMock}
          selectedId={selectedJugadorId}
          onSelect={(id) => setSelectedJugadorId(id)}
        />
      </main>
    </div>
  );
};

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
