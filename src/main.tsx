import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ItemsList from './components/ItemsList';
import JugadoresList from './components/JugadoresList';
import { useCharacters } from './hooks/useCharacters';
import { useSelectedCharacter } from './hooks/useSelectedCharacter.ts';
import Popup from './components/Popup';
import CreateCharacterForm from './components/CreateCharacterForm';
import PlayerStatus from './components/PlayerStatus';
import CreateItemForm from './components/CreateItemForm';
import CreateCharacterItemForm from './components/CreateCharacterItem.tsx';

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
  
  // Combined hook destructuring from both branches
  const {
    characters,
    loading,
    error,
    reload,
    toggleItemEquipped,
    toggleItemPublic,
    updateItemNotes,
    createCharacterItem,
  } = useCharacters(1);

  // Kept from player-status branch
  const [activeTab, setActiveTab] = useState<'inventory' | 'status'>('inventory');

  // Kept from master branch
  const [isAPopupOpen, setIsAPopupOpen] = useState(false);
  const [isCreateItemPopupOpen, setCreateItemPopupOpen] = useState(false);
  const [isCreateCharacterItemPopupOpen, setIsCreateCharacterItemPopupOpen] =
    useState(false);
  const [inventarioSeleccionado, setInventarioSeleccionado] =
    useState<number>(selectedJugadorId);
  const jugadorSeleccionado =
    characters.find((j) => j.id === inventarioSeleccionado) || null;

  const handleCreateCharacterItem = async (
    itemId: number,
    ownerId: number,
    itemCount: number
  ) => {

    try {
      await createCharacterItem({
        item_id: itemId,
        character_id: ownerId,
        count: itemCount,
        is_equipped: false,
        public: false,
        notes: '',
      });
      setIsCreateCharacterItemPopupOpen(false);
      setIsAPopupOpen(false);
      reload();
    } catch (error) {
      console.error('Error creating character item:', error);
    }
  };

  return (
    <div className="app-container">
      <main className="app-main">
        <div className="character-select-container">
          {selectedJugadorId.toString() ==
            window.localStorage.getItem('dungeon_master') && (
              <div className="character-select-container">
          <button
            className="big-button"
            onClick={() => {
              if (!isAPopupOpen) {
                setCreateItemPopupOpen(true);
                setIsAPopupOpen(true);
              }
            }}
          >
            Crear Item
          </button>
          <button
            className="big-button"
            onClick={() => {
              if (!isAPopupOpen) {
                setIsCreateCharacterItemPopupOpen(true);
                setIsAPopupOpen(true);
              }
            }}
          >
            Agregar Item
          </button>
              </div>
        )}
        </div>
        {isCreateItemPopupOpen && (
          <Popup
            title="Crear Item"
            onClose={() => {
              setCreateItemPopupOpen(false);
              setIsAPopupOpen(false);
            }}
          >
            <CreateItemForm
              onClose={() => {
                setCreateItemPopupOpen(false);
                setIsAPopupOpen(false);
              }}
            />
          </Popup>
        )}
        {isCreateCharacterItemPopupOpen && (
          <Popup
            title="Crear Item de Personaje"
            onClose={() => {
              setIsCreateCharacterItemPopupOpen(false);
              setIsAPopupOpen(false);
            }}
          >
            <CreateCharacterItemForm
              onSubmit={handleCreateCharacterItem}
              onCancel={() => {
                setIsCreateCharacterItemPopupOpen(false);
                setIsAPopupOpen(false);
              }}
            />
          </Popup>
        )}
        {loading && characters.length === 0 ? (
          <div className="list-container">
            <h2>Cargando...</h2>
          </div>
        ) : (
          <div className="main-content-area">
            <div className="tabs">
              <button
                className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setActiveTab('inventory')}
              >
                Inventario
              </button>
              <button
                className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
                onClick={() => setActiveTab('status')}
              >
                Estatus
              </button>
            </div>
            {activeTab === 'inventory' ? (
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
            ) : (
              jugadorSeleccionado && (
                <PlayerStatus characterId={jugadorSeleccionado.id} />
              )
            )}
          </div>
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