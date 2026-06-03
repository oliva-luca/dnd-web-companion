import React, { useState, useEffect } from 'react';
import { useItems } from '../hooks/useItem';
import { Item } from '../types';

interface EditItemFormProps {
  item: Item;
  onClose: () => void;
  onSave: (updatedItem: Item) => void;
}

const EditItemForm: React.FC<EditItemFormProps> = ({ item, onClose, onSave }) => {
  const { items, updateItem, error } = useItems();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(item.id);
  const [formData, setFormData] = useState<Partial<Item>>(item);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedItemId) {
      const selectedItem = items.find(item => item.id === selectedItemId);
      if (selectedItem) {
        setFormData(selectedItem);
      }
    } else {
      setFormData({});
    }
  }, [selectedItemId, items]);

  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItemId(Number(e.target.value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;
    try {
      const updatedItem = await updateItem(selectedItemId, formData);
      if (updatedItem) {
        onSave(updatedItem);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="edit-item-search">Buscar item</label>
        <input
          id="edit-item-search"
          type="text"
          placeholder="Escribí para filtrar…"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedItemId || ''}
          onChange={handleItemChange}
          required
        >
          <option value="">Seleccioná un item</option>
          {filteredItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      {selectedItemId && (
        <>
          <div className="form-group">
            <label htmlFor="edit-item-name">Nombre</label>
            <input
              id="edit-item-name"
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-item-weight">Peso (kg)</label>
            <input
              id="edit-item-weight"
              type="number"
              name="weight"
              value={formData.weight || 0}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-item-value">Valor ($)</label>
            <input
              id="edit-item-value"
              type="number"
              name="value"
              value={formData.value || 0}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-item-category">Categoría</label>
            <input
              id="edit-item-category"
              type="text"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-item-description">Descripción</label>
            <textarea
              id="edit-item-description"
              name="description"
              rows={4}
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>
          {error && <p className="error">Error: {error.message}</p>}
        </>
      )}
      <div className="form-actions">
        <button type="button" onClick={onClose} className="secondary-button">
          Cancelar
        </button>
        {selectedItemId && (
          <button type="submit" className="primary-button">
            Guardar
          </button>
        )}
      </div>
    </form>
  );
};

export default EditItemForm;