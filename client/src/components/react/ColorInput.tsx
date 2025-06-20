// src/components/ColorInput.tsx
import React, { useState, useEffect } from 'react';
import chroma from 'chroma-js'; // Seguimos necesitando chroma para validar
import type { Harmony } from '../../lib/colorUtils';

interface Props {
  baseColor: string;
  harmony: Harmony;
  onColorChange: (newColor: string) => void;
  onHarmonyChange: (newHarmony: Harmony) => void;
}

export const ColorInput = ({ baseColor, harmony, onColorChange, onHarmonyChange }: Props) => {
  const [inputValue, setInputValue] = useState(baseColor);

  useEffect(() => {
    setInputValue(baseColor);
  }, [baseColor]);

  const handleApplyColor = (e: React.FormEvent) => {
    e.preventDefault();

    if (chroma.valid(inputValue)) {
      onColorChange(inputValue);
    } else {
      alert(`El color "${inputValue}" no es un código de color válido.`);
    }
  };

   const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onColorChange(e.target.value);
  };


  return (
    <form onSubmit={handleApplyColor} >
      <div>
        <label htmlFor="color-picker">Color Base</label>
        <input
          type="color"
          id="color-picker"
          value={chroma.valid(inputValue) ? inputValue : '#000000'}
          onChange={handleColorPickerChange}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} 
        />
        <button type="submit">
          Aplicar
        </button>
      </div>
      <div>
        <label htmlFor="harmony-select" style={{ display: 'block', marginBottom: '5px' }}>Armonía</label>
        <select
          id="harmony-select"
          value={harmony}
          onChange={(e) => onHarmonyChange(e.target.value as Harmony)}
        >
          <option value="monochromatic">Monocromática</option>
          <option value="analogous">Análoga</option>
          <option value="complementary">Complementaria</option>
          <option value="triadic">Triádica</option>
        </select>
      </div>
    </form>
  );
};