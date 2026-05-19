import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import ItemsList from './components/ItemsList';
import JugadoresList from './components/JugadoresList';
import { useCharacters } from './hooks/useCharacters';

const App: React.FC = () => {
  const [selectedJugadorId, setSelectedJugadorId] = useState<number | null>(null);
  const uc = useCharacters(1);
  const { characters, loading, error, reload } = uc;

  // select first character on load
  useEffect(() => {
    if (!selectedJugadorId && characters.length > 0) {
      setSelectedJugadorId(characters[0].id);
    }
  }, [characters, selectedJugadorId]);

  const jugadorSeleccionado = characters.find((j) => j.id === selectedJugadorId) || null;

  return (
    <div className="app-container">
      <main className="app-main">
        {loading ? (
          <div className="list-container">
            <h2>Cargando...</h2>
          </div>
        ) : (
          <ItemsList items={jugadorSeleccionado ? jugadorSeleccionado.inventario : []} jugador={jugadorSeleccionado ? jugadorSeleccionado.nombre : 'Seleccionar jugador'} />
        )}

        <div className="controls">
          <button onClick={() => reload()} disabled={loading}>
            Refrescar
          </button>
          {error && (
            <div className="error">Error al cargar datos: {String(error?.message || error)}</div>
          )}
        </div>

        <JugadoresList
          jugadores={characters}
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
