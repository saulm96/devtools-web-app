import { useState } from "react";

import styles from './PaletteDisplay.module.css'

interface PaletteDisplayProps {
  colors: string[];
}

export const PaletteDisplay = ({ colors }: PaletteDisplayProps) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1000);
  };

  return (
    <div className={styles.paletteDisplay}>
      {colors.map((color) => (
        <div  
        key={color} 
        onClick={() => handleCopy(color)}
        style={{backgroundColor: color}}>
          <span
          >
            {copiedColor === color ? "¡Copiado!" : color}
          </span>{" "}
        </div>
      ))}
    </div>
  );
};
