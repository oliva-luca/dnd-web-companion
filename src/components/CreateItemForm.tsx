import React, { useState } from 'react';
import { useItems } from '../hooks/useItem';
import { Item } from '../types';

interface CreateItemFormProps {
  onClose: () => void;
}

const CreateItemForm: React.FC<CreateItemFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(0);
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const { createItem } = useItems();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Omit<Item, 'id'> = {
      name,
      weight,
      value,
      category,
      description,
    };
    await createItem(newItem);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="item-name">Nombre</label>
        <input
          id="item-name"
          type="text"
          placeholder="Espada larga"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="item-weight">Peso (kg)</label>
        <input
          id="item-weight"
          type="number"
          placeholder="0"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="item-value">Valor ($)</label>
        <input
          id="item-value"
          type="number"
          placeholder="0"
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="item-category">Categoría</label>
        <input
          id="item-category"
          type="text"
          placeholder="Armas, Consumibles…"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="item-description">Descripción</label>
        <textarea
          id="item-description"
          placeholder="Detalles del item…"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onClose} className="secondary-button">
          Cancelar
        </button>
        <button type="submit" className="primary-button">
          Crear
        </button>
      </div>
    </form>
  );
};

export default CreateItemForm;