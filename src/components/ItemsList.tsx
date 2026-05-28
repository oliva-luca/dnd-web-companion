import React, { useEffect, useState, useRef } from 'react';
import { CharacterItem, Jugador } from '../types';
import './shared.css';
import './ItemsList.css';
import './ItemMenu.css';
import Linkify from 'react-linkify';
import { useSelectedCharacter } from '../hooks/useSelectedCharacter.ts';

const agruparPorCategoriaYOrdenar = (items: CharacterItem[], jugadorId: number, selectedCharacterId: number | null): Record<string, CharacterItem[]> => {
  const itemsOrdenados = [...items].sort((a, b) => a.item.name.localeCompare(b.item.name));

  // 2. Luego hacemos el reduce sobre la lista ya ordenada
  return itemsOrdenados.reduce((acc, item) => {
    if (!acc[item.item.category])
      acc[item.item.category] = [];
    if (
      selectedCharacterId == jugadorId ||
      item.public ||
      selectedCharacterId?.toString() ==
        window.localStorage.getItem('dungeon_master')
    ) {
      acc[item.item.category].push(item);
    }
    return acc;
  }, {} as Record<string, CharacterItem[]>);
};

const pesoTotal = (items: CharacterItem[]): number => {
  return items.reduce((total, item) => total + item.item.weight * item.count, 0);
};

const categoriaIconos: Record<string, string> = {
  Armas: '󰓥',
  Armaduras: '',
  Consumibles: '',
  Herramientas: '󱁤',
  Artefactos: '󰬯',
  Misc: '',
};

type ItemsListProps = {
  items: CharacterItem[];
  jugador: string;
  jugadorId: number;
  onToggleEquipped?: (characterItemId: number, currentEquipped: boolean) => void;
  onTogglePublic?: (characterItemId: number, currentPublic: boolean) => void;
  onUpdateItemNotes?: (characterItemId: number, notes: string) => void;
  openMenuId: number | null;
  setOpenMenuId: (id: number | null) => void;
  changeItemOwner: (characterItemId: number, newOwnerId: number) => Promise<void>;
  setNewItemCount: (characterItemId: number, count: number) => Promise<void>;
  characters: Jugador[];
};

export const ItemsList: React.FC<ItemsListProps> = ({ items, jugador, jugadorId, onToggleEquipped, onTogglePublic, onUpdateItemNotes, openMenuId, setOpenMenuId, changeItemOwner, setNewItemCount, characters }) => {
  const [openTextDisplay, setOpenTextDisplay] = useState<{
    [key: number]: 'description' | 'notes' | null;
  }>({});
  const [editableNotes, setEditableNotes] = useState<{ [key: number]: string }>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedCharacterId] = useSelectedCharacter();
  const [selectNewOwner, setSelectNewOwner] = useState<number | null>(null);
  const [selectedNewOwnerId, setSelectedNewOwnerId] = useState<number | null>(null);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  const [removeQuantity, setRemoveQuantity] = useState(1);
  const characterOptions = characters.filter((c) => c.nombre !== 'Party');


  const handleTextDisplayToggle = (
    itemId: number,
    type: 'description' | 'notes',
  ) => {
    setOpenTextDisplay((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === type ? null : type,
    }));
  };

  const handleNotesChange = (itemId: number, newNotes: string) => {
    setEditableNotes((prev) => ({ ...prev, [itemId]: newNotes }));
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSaveNotes = (itemId: number) => {
    if (onUpdateItemNotes && editableNotes[itemId] !== undefined) {
      onUpdateItemNotes(itemId, editableNotes[itemId]);
    }
  };

  useEffect(() => {
    if (openMenuId === null) {
      setOpenTextDisplay({});
    }
  }, [openMenuId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [openTextDisplay]);

  useEffect(() => {
    console.debug('ItemsList props - items count:', items.length, 'jugador:', jugador)
  }, [items, jugador])
  const itemsPorCategoria = agruparPorCategoriaYOrdenar(items, jugadorId, selectedCharacterId);
  const categorias = Object.keys(itemsPorCategoria).sort();
  const pesoInventario = pesoTotal(items);

  return (
    <div className="list-container items-list">
      <h2>
        {jugador} ({pesoInventario}kg)
      </h2>
      <hr className="solid" />
      <div className="items-por-categoria">
        {categorias.map((categoria) => (
          <div key={categoria} className="categoria-grupo">
            <h3 className="categoria-titulo">
              <i className="nf" style={{fontSize: '20px'}}> {categoriaIconos[categoria] || ''} </i>
              {categoria}
            </h3>
            <ul>
              {itemsPorCategoria[categoria].map((characterItem) => {
                const { item } = characterItem;
                const idKey = characterItem.id;
                const menuOpen = openMenuId === idKey;
                const textDisplayOpen = openTextDisplay[idKey];

                return (
                  <li
                    key={idKey}
                    className={`item${characterItem.is_equipped ? ' equipped' : ''}`}
                  >
                    <div className="item-main">
                      <span className="item-name">{item.name}</span>
                      <span className="cantidad">x{characterItem.count}</span>
                      <span className="peso">{item.weight}kg</span>
                      <span className="valor">${item.value}</span>
                      {characterItem.id && onToggleEquipped && (
                        <button
                          className="menu-button"
                          onClick={() => setOpenMenuId(menuOpen ? null : idKey)}
                          aria-expanded={menuOpen}
                          aria-controls={`menu-${idKey}`}
                          title={menuOpen ? 'Close' : 'Options'}
                        >
                          ⋮
                        </button>
                      )}
                    </div>

                    {menuOpen && (
                      <div className="item-menu" id={`menu-${idKey}`}>
                        <div>
                          <button
                            className="simple-button"
                            onClick={() =>
                              handleTextDisplayToggle(idKey, 'description')
                            }
                          >
                            Descripción
                          </button>
                          {selectedCharacterId == jugadorId ? (
                            <button
                              className="simple-button"
                              onClick={() =>
                                handleTextDisplayToggle(idKey, 'notes')
                              }
                            >
                              Notas
                            </button>
                          ) : null}
                        </div>
                        <div>
                        <button
                          className="simple-button"
                          onClick={() => setSelectNewOwner(idKey)}
                        >
                          Dar a
                        </button>
                        {selectNewOwner === idKey && (
                          <div className="form-group">
                            <select
                              id="ownerId"
                              value={selectedNewOwnerId ?? ''}
                              onChange={(e) =>
                                setSelectedNewOwnerId(Number(e.target.value))
                              }
                              required
                            >
                              {characterOptions.map((character) => (
                                <option key={character.id} value={character.id}>
                                  {character.nombre}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={async () => {
                                if (selectedNewOwnerId !== null) {
                                  await changeItemOwner(idKey, selectedNewOwnerId);
                                  setSelectNewOwner(null);
                                }
                              }}
                            >
                              Confirmar
                            </button>
                            <button onClick={() => setSelectNewOwner(null)}>
                              Cancelar
                            </button>
                          </div>
                        )}
                        </div>
                        {selectedCharacterId == jugadorId ||
                        selectedCharacterId.toString() ==
                          window.localStorage.getItem('dungeon_master') ? (
                          <div>
                            <button
                              className="equip-button"
                              onClick={async () => {
                                if (characterItem.id && onToggleEquipped) {
                                  onToggleEquipped(
                                    characterItem.id,
                                    characterItem.is_equipped ?? false,
                                  );
                                }
                              }}
                            >
                              {characterItem.is_equipped
                                ? 'Desequipar'
                                : 'Equipar'}
                            </button>
                            <button
                              className="simple-button"
                              onClick={() => setItemToRemove(idKey)}
                            >
                              Eliminar
                            </button>
                            {itemToRemove === idKey && (
                              <div className="form-group">
                                <input
                                  type="number"
                                  value={removeQuantity}
                                  onChange={(e) =>
                                    setRemoveQuantity(Number(e.target.value))
                                  }
                                  min="1"
                                  max={characterItem.count}
                                />
                                <button
                                  onClick={async () => {
                                    const newCount =
                                      characterItem.count - removeQuantity;
                                    await setNewItemCount(idKey, newCount);
                                    setItemToRemove(null);
                                  }}
                                >
                                  Confirmar
                                </button>
                                <button onClick={() => setItemToRemove(null)}>
                                  Cancelar
                                </button>
                              </div>
                            )}
                            <button
                              className="simple-button"
                              onClick={() => {
                                if (characterItem.id && onTogglePublic) {
                                  onTogglePublic(
                                    characterItem.id,
                                    characterItem.public ?? true,
                                  );
                                }
                              }}
                            >
                              <i className="nf">
                                {characterItem.public ? '' : ''}
                              </i>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {textDisplayOpen && (
                      <div className="text-display">
                        {textDisplayOpen === 'description' && (
                          <p style={{ whiteSpace: 'pre-wrap' }}>
                            <Linkify
                              componentDecorator={(
                                decoratedHref: string,
                                decoratedText: string,
                                key: React.Key,
                              ) => (
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={decoratedHref}
                                  key={key}
                                >
                                  {decoratedText}
                                </a>
                              )}
                            >
                              {item.description ||
                                'No hay descripción disponible.'}
                            </Linkify>
                          </p>
                        )}
                        {textDisplayOpen === 'notes' && (
                          <div className="notes-container">
                            <textarea
                              ref={textareaRef}
                              className="notes-textarea"
                              defaultValue={characterItem.notes || ''}
                              onChange={(e) =>
                                handleNotesChange(idKey, e.target.value)
                              }
                            />
                            <div className="save-button-container">
                              <button
                                className="simple-button"
                                onClick={() => handleSaveNotes(idKey)}
                              >
                                Guardar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;