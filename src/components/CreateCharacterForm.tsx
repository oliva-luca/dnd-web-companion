import React, { useState } from 'react';
import { CharacterClasses } from '../types';

interface CreateCharacterFormProps {
  onSubmit: (name: string, characterClass: number, level: number) => void;
  onCancel: () => void;
}

export const CreateCharacterForm: React.FC<CreateCharacterFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState(0);
  const [level, setLevel] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, characterClass, level);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="class">Clase</label>
        <select
          id="class"
          value={characterClass}
          onChange={(e) => setCharacterClass(Number(e.target.value))}
          required
        >
          {Object.keys(CharacterClasses)
            .filter((key) => isNaN(Number(key)))
            .map((key, index) => (
              <option key={index} value={index}>
                {key}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="level">Nivel</label>
        <input
          type="number"
          id="level"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="simple-button">Crear</button>
        <button type="button" className="simple-button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default CreateCharacterForm;