import React, { useState } from 'react';
import './PlayerStatus.css';
import { useCharacterStats, SPELL_LEVELS } from '../hooks/useCharacterStats';

interface PlayerStatusProps {
  characterId: number;
}

const getHealthColor = (percentage: number) => {
  if (percentage > 75) return '#4CAF50'; // Green
  if (percentage > 50) return '#FFC107'; // Yellow
  if (percentage > 25) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

const PlayerStatus: React.FC<PlayerStatusProps> = ({ characterId }) => {
  const {
    stats,
    setMaxHp,
    setCurrentHp,
    adjustCurrentHp,
    setSlotMax,
    useSlot,
    restoreSlot,
    longRest,
  } = useCharacterStats(characterId);
  const [editingHp, setEditingHp] = useState(false);
  const [editingSlots, setEditingSlots] = useState(false);

  const { currentHp, maxHp } = stats;
  const hpPercentage = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
  const healthColor = getHealthColor(hpPercentage);
  const conicGradient = `conic-gradient(${healthColor} ${hpPercentage}%, rgba(0, 0, 0, 0.12) ${hpPercentage}%)`;

  const activeLevels = SPELL_LEVELS.filter(
    (level) => (stats.spellSlots[level]?.max ?? 0) > 0,
  );

  return (
    <div className="player-status-container">
      <div className="status-header">
        <h3>Estatus del Personaje</h3>
        <button className="rest-button" onClick={longRest}>
          Descanso largo
        </button>
      </div>

      <div className="status-grid">
        <div className="health-widget">
          <h4>Puntos de Vida</h4>
          <div className="health-circle" style={{ background: conicGradient }}>
            <div className="health-circle-inner">
              <span className="hp-text">{`${currentHp} / ${maxHp}`}</span>
              <span className="hp-percent">{Math.round(hpPercentage)}%</span>
            </div>
          </div>

          <div className="hp-controls">
            <button onClick={() => adjustCurrentHp(-1)} aria-label="Quitar 1 de vida">
              −
            </button>
            <input
              type="number"
              className="hp-input"
              value={currentHp}
              min={0}
              max={maxHp}
              onChange={(e) => setCurrentHp(Number(e.target.value))}
            />
            <button onClick={() => adjustCurrentHp(1)} aria-label="Sumar 1 de vida">
              +
            </button>
          </div>

          <button className="link-button" onClick={() => setEditingHp((v) => !v)}>
            {editingHp ? 'Listo' : 'Editar vida máxima'}
          </button>
          {editingHp && (
            <label className="max-hp-edit">
              Vida máxima
              <input
                type="number"
                min={0}
                value={maxHp}
                onChange={(e) => setMaxHp(Number(e.target.value))}
              />
            </label>
          )}
        </div>

        <div className="spell-widget">
          <div className="spell-header">
            <h4>Espacios de Conjuros</h4>
            <button
              className="link-button"
              onClick={() => setEditingSlots((v) => !v)}
            >
              {editingSlots ? 'Listo' : 'Configurar'}
            </button>
          </div>

          {editingSlots ? (
            <div className="slot-config">
              {SPELL_LEVELS.map((level) => (
                <label key={level} className="slot-config-row">
                  <span>Nivel {level}</span>
                  <input
                    type="number"
                    min={0}
                    value={stats.spellSlots[level]?.max ?? 0}
                    onChange={(e) => setSlotMax(level, Number(e.target.value))}
                  />
                </label>
              ))}
            </div>
          ) : activeLevels.length === 0 ? (
            <p className="empty-hint">
              No hay espacios configurados. Usá «Configurar» para definir cuántos
              espacios tenés por nivel.
            </p>
          ) : (
            <div className="slot-list">
              {activeLevels.map((level) => {
                const slot = stats.spellSlots[level];
                const remaining = slot.max - slot.used;
                return (
                  <div key={level} className="slot-row">
                    <span className="slot-level">Nivel {level}</span>
                    <div className="slot-pips">
                      {Array.from({ length: slot.max }).map((_, i) => (
                        <span
                          key={i}
                          className={`pip ${i < remaining ? 'available' : 'used'}`}
                        />
                      ))}
                    </div>
                    <span className="slot-count">
                      {remaining} / {slot.max}
                    </span>
                    <div className="slot-controls">
                      <button
                        onClick={() => useSlot(level)}
                        disabled={remaining <= 0}
                      >
                        Usar
                      </button>
                      <button
                        onClick={() => restoreSlot(level)}
                        disabled={slot.used <= 0}
                        aria-label={`Recuperar espacio de nivel ${level}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStatus;
