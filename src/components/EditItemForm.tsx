import React, { useState, useEffect } from 'react';
import { useItems } from '../hooks/useItem';
import { Item } from '../types';

interface EditItemFormProps {
  onClose: () => void;
  onSave: (updatedItem: Item) => void;
}

const EditItemForm: React.FC<EditItemFormProps> = ({ onClose, onSave }) => {
  const { items, updateItem, error } = useItems();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Item>>({});
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
      <div>
        <label>Search Item:</label>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedItemId || ''}
          onChange={handleItemChange}
          required
        >
          <option value="">Select an item</option>
          {filteredItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      {selectedItemId && (
        <>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Weight:</label>
            <input
              type="number"
              name="weight"
              value={formData.weight || 0}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Value:</label>
            <input
              type="number"
              name="value"
              value={formData.value || 0}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>
          {error && <p>Error: {error.message}</p>}
          <button type="submit">Save</button>
        </>
      )}
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default EditItemForm;