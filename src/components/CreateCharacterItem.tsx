import React, { useEffect, useState } from 'react';
import { useCharacters } from '../hooks/useCharacters';
import { useItems } from '../hooks/useItem';

interface CreateCharacterItemProps {
  onSubmit: (itemId: number, ownerId: number, itemCount: number) => void;
  onCancel: () => void;
}

export const CreateCharacterItemForm: React.FC<CreateCharacterItemProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { characters } = useCharacters();
  const { items } = useItems();
  const [itemId, setItemId] = useState(0);
  const [itemCount, setItemCount] = useState(1);
  const [itemSearch, setItemSearch] = useState('');
  const [ownerId, setOwnerId] = useState(
    characters.find((c) => c.nombre == 'Mundo')?.id ?? 1,
  );

  useEffect(() => {
    if (items.length > 0) {
      setItemId(items[0].id);
    }
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(itemId, ownerId, itemCount);
  };

  const characterOptions = characters.filter(
    (c) => c.nombre !== 'Party'
  );

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase()),
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="itemId">Item</label>
        <input
          type="text"
          placeholder="Buscar item..."
          value={itemSearch}
          onChange={(e) => setItemSearch(e.target.value)}
        />
        <select
          id="itemId"
          value={itemId}
          onChange={(e) => setItemId(Number(e.target.value))}
          required
        >
          {filteredItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="ownerId">Dueno</label>
        <select
          id="ownerId"
          value={ownerId}
          onChange={(e) => setOwnerId(Number(e.target.value))}
          required
        >
          {characterOptions.map((character) => (
            <option key={character.id} value={character.id}>
              {character.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="count">Cantidad</label>
        <input
          type="number"
          id="cantidad"
          value={itemCount}
          onChange={(e) => setItemCount(Number(e.target.value))}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="simple-button">
          Crear
        </button>
        <button type="button" className="simple-button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default CreateCharacterItemForm;