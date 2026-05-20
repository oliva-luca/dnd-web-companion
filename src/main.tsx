import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import ItemsList from './components/ItemsList';
import JugadoresList from './components/JugadoresList';
import { useCharacters } from './hooks/useCharacters';

const App: React.FC = () => {
  const [selectedJugadorId, setSelectedJugadorId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const { characters, loading, error, reload, toggleItemEquipped, toggleItemPublic, updateItemNotes } = useCharacters(1);

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
        {/* If loading and no characters yet, show full loading. Otherwise keep showing current data and show small loader */}
        {loading && characters.length === 0 ? (
          <div className="list-container">
            <h2>Cargando...</h2>
          </div>
        ) : (
          <ItemsList
            items={jugadorSeleccionado ? jugadorSeleccionado.inventario : []}
            jugador={jugadorSeleccionado ? jugadorSeleccionado.nombre : 'Seleccionar jugador'}
            onToggleEquipped={toggleItemEquipped}
            onTogglePublic={toggleItemPublic}
            onUpdateItemNotes={updateItemNotes}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
          />
        )}

        {loading && characters.length > 0 && (
          <div className="loading-indicator">Cargando...</div>
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