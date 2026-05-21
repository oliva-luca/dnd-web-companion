import React, { useEffect, useState, useRef } from 'react';
import { Item } from '../types';
import './shared.css';
import './ItemsList.css';
import './ItemMenu.css';
import Linkify from 'react-linkify';
import { useSelectedCharacter } from '../hooks/useSelectedCharacter.ts';

const agruparPorCategoriaYOrdenar = (items: Item[], jugadorId: number, selectedCharacterId: number | null): Record<string, Item[]> => {
  const itemsOrdenados = [...items].sort((a, b) => a.nombre.localeCompare(b.nombre));

  // 2. Luego hacemos el reduce sobre la lista ya ordenada
  return itemsOrdenados.reduce((acc, item) => {
    if (!acc[item.categoria])
      acc[item.categoria] = [];
    if ((selectedCharacterId == jugadorId || item.public)) {
      acc[item.categoria].push(item);
    }
    return acc;
  }, {} as Record<string, Item[]>);
};

const pesoTotal = (items: Item[]): number => {
  return items.reduce((total, item) => total + item.peso * item.cantidad, 0);
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
  items: Item[];
  jugador: string;
  jugadorId: number;
  onToggleEquipped?: (characterItemId: number, currentEquipped: boolean) => void;
  onTogglePublic?: (characterItemId: number, currentPublic: boolean) => void;
  onUpdateItemNotes?: (characterItemId: number, notes: string) => void;
  openMenuId: number | null;
  setOpenMenuId: (id: number | null) => void;
};

export const ItemsList: React.FC<ItemsListProps> = ({ items, jugador, jugadorId, onToggleEquipped, onTogglePublic, onUpdateItemNotes, openMenuId, setOpenMenuId }) => {
  const [openTextDisplay, setOpenTextDisplay] = useState<{
    [key: number]: 'description' | 'notes' | null;
  }>({});
  const [editableNotes, setEditableNotes] = useState<{ [key: number]: string }>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedCharacterId] = useSelectedCharacter();

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
              {itemsPorCategoria[categoria].map((item) => {
                const idKey = item.character_item_id || item.id;
                const menuOpen = openMenuId === idKey;
                const textDisplayOpen = openTextDisplay[idKey];

                return (
                  <li
                    key={idKey}
                    className={`item${item.is_equipped ? ' equipped' : ''}`}
                  >
                    <div className="item-main">
                      <span className="item-name">{item.nombre}</span>
                      <span className="cantidad">x{item.cantidad}</span>
                      <span className="peso">{item.peso}kg</span>
                      <span className="valor">${item.valor}</span>
                      {item.character_item_id && onToggleEquipped && (
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

                        {selectedCharacterId == jugadorId ? (
                          <div>
                            <button
                              className="simple-button"
                              style={{ justifyContent: 'flex-end' }}
                            >
                              Borrar
                            </button>
                            <button
                              className="equip-button"
                              onClick={async () => {
                                if (
                                  item.character_item_id &&
                                  onToggleEquipped
                                ) {
                                  onToggleEquipped(
                                    item.character_item_id,
                                    item.is_equipped ?? false,
                                  );
                                }
                              }}
                            >
                              {item.is_equipped ? 'Desequipar' : 'Equipar'}
                            </button>
                            <button className="simple-button">Usar</button>
                            <button
                              className="simple-button"
                              onClick={() => {
                                if (item.character_item_id && onTogglePublic) {
                                  onTogglePublic(
                                    item.character_item_id,
                                    item.public ?? true,
                                  );
                                }
                              }}
                            >
                              <i className="nf">{item.public ? '' : ''}</i>
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
                              {item.descripcion ||
                                'No hay descripción disponible.'}
                            </Linkify>
                          </p>
                        )}
                        {textDisplayOpen === 'notes' && (
                          <div className="notes-container">
                            <textarea
                              ref={textareaRef}
                              className="notes-textarea"
                              defaultValue={item.notas || ''}
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