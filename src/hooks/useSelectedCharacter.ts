import { useState, useEffect } from 'react';

// Definimos la clave de forma constante y global para este hook
const STORAGE_KEY = 'app_selected_character_id';

export const useSelectedCharacter = (initialValue: string | null = null) => {
  // 1. Inicializamos el estado leyendo de localStorage (si existe)
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    () => {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        // Si hay un item guardado, lo parseamos. Si no, usamos el valor inicial.
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.warn('Error leyendo de localStorage:', error);
        return initialValue;
      }
    },
  );

  // 2. Efecto para guardar en localStorage cada vez que el ID cambie
  useEffect(() => {
    try {
      if (selectedCharacterId === null) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(selectedCharacterId),
        );
      }
    } catch (error) {
      console.warn('Error guardando en localStorage:', error);
    }
  }, [selectedCharacterId]);

  // Retornamos la misma firma que un useState normal
  return [selectedCharacterId, setSelectedCharacterId] as const;
};

