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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">Crear Nuevo Item</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Peso"
        value={weight}
        onChange={(e) => setWeight(parseFloat(e.target.value))}
        className="p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Valor"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded"
      />
      <textarea
        placeholder="Descripción"
        style={{width: '72%'}}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border rounded"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="p-2">
          Cancelar
        </button>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Crear
        </button>
      </div>
    </form>
  );
};

export default CreateItemForm;