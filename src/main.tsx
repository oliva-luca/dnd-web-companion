import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ItemsList from './components/ItemsList';
import JugadoresList from './components/JugadoresList';
import { useCharacters } from './hooks/useCharacters';
import { useSelectedCharacter } from './hooks/useSelectedCharacter.ts';

interface CharacterSelectScreenProps {
  onSelect: (id: number) => void;
}

const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({ onSelect }) => {
  const { characters, loading } = useCharacters(1);

 return (
   <div className="app-container">
     <main className="app-main">
       {/* If loading and no characters yet, show full loading. Otherwise keep showing current data and show small loader */}
       {loading && characters.length === 0 ? (
         <div className="list-container">
           <h2>Cargando...</h2>
         </div>
       ) : (
         <JugadoresList
           jugadores={characters}
           selectedId={-1}
           onSelect={onSelect}
         ></JugadoresList>
       )}
     </main>
   </div>
 );
}

interface AppProps {
  selectedJugadorId: number;
  setSelectedJugadorId: (id: number) => void;
}

const App: React.FC<AppProps> = ({ selectedJugadorId, setSelectedJugadorId }) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const { characters, loading, error, reload, toggleItemEquipped, toggleItemPublic, updateItemNotes } = useCharacters(1);

  const [inventarioSeleccionado, setInventarioSeleccionado] = useState<number>(selectedJugadorId);
  const jugadorSeleccionado = characters.find((j) => j.id === inventarioSeleccionado) || null;

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
            jugador={
              jugadorSeleccionado
                ? jugadorSeleccionado.nombre
                : 'Seleccionar jugador'
            }
            jugadorId={jugadorSeleccionado?.id || -1}
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
          <button onClick={() => setSelectedJugadorId(-1)} disabled={loading}>
            <i className="nf" style={{ fontSize: 24 }}>
              
            </i>
          </button>
          <button onClick={() => reload()} disabled={loading}>
            <i className="nf" style={{ fontSize: 24 }}>
              
            </i>
          </button>
          {error && (
            <div className="error">
              Error al cargar datos: {String(error?.message || error)}
            </div>
          )}
        </div>

        <JugadoresList
          jugadores={characters}
          selectedId={inventarioSeleccionado}
          onSelect={setInventarioSeleccionado}
        />
      </main>
    </div>
  );
};

// Componente principal que actúa como enrutador
const MainRouter: React.FC = () => {
  // Obtenemos el ID del personaje seleccionado usando tu hook
  const [selectedCharacterId, setSelectedCharacterId] = useSelectedCharacter(-1);

  // Renderizado condicional: si hay ID mostramos la App, si no, la pantalla de selección
  return selectedCharacterId !== -1 ? (
    <App selectedJugadorId={selectedCharacterId} setSelectedJugadorId={setSelectedCharacterId} />
  ) : (
    <CharacterSelectScreen onSelect={setSelectedCharacterId} />
  );
};

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>
);