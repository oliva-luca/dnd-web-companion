import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ItemsList from './components/ItemsList';
import JugadoresList from './components/JugadoresList';
import { useCharacters } from './hooks/useCharacters';
import { useSelectedCharacter } from './hooks/useSelectedCharacter.ts';
import Popup from './components/Popup';
import CreateCharacterForm from './components/CreateCharacterForm';

interface CharacterSelectScreenProps {
  onSelect: (id: number) => void;
}

const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({ onSelect }) => {
  const { characters, loading, createCharacter } = useCharacters(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const filteredCharacters = characters
    .filter(c => c.nombre !== 'Party')
    .map(c => c.nombre === 'Mundo' ? { ...c, nombre: 'Dungeon Master' } : c);

  const handleCreateCharacter = async (name: string, characterClass: number, level: number) => {
    await createCharacter(name, characterClass, level);
    setIsPopupOpen(false);
  };

  return (
    <div className="app-container">
      <main className="app-main">
        {loading && characters.length === 0 ? (
          <div className="list-container">
            <h2>Cargando...</h2>
          </div>
        ) : (
          <div className="character-select-container">
            <JugadoresList
              jugadores={filteredCharacters}
              selectedId={-1}
              onSelect={onSelect}
            />
            <button className="big-button" onClick={() => setIsPopupOpen(true)}>
              Crear Personaje
            </button>
          </div>
        )}
        {isPopupOpen && (
          <Popup title="Crear Personaje" onClose={() => setIsPopupOpen(false)}>
            <CreateCharacterForm
              onSubmit={handleCreateCharacter}
              onCancel={() => setIsPopupOpen(false)}
            />
          </Popup>
        )}
      </main>
    </div>
  );
};

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
  const [selectedCharacterId, setSelectedCharacterId] = useSelectedCharacter();

  return selectedCharacterId !== -1 ? (
    <App selectedJugadorId={selectedCharacterId} setSelectedJugadorId={setSelectedCharacterId} />
  ) : (
    <CharacterSelectScreen onSelect={setSelectedCharacterId} />
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>
);