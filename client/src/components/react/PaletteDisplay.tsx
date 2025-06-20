import { useState } from "react";

interface PaletteDisplayProps {
  colors: string[];
}

export const PaletteDisplay = ({ colors }: PaletteDisplayProps) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1000); // Desaparece el cmensaje de copiado después de 1 segundo
  };

  return (
    <div>
      {colors.map((color) => (
        <div key={color} 
        onClick={() => handleCopy(color)}
        style={{backgroundColor: color}}>
        {/*-For now we will show the color as abackground color of this div. In the future maybe we should generate another div to show the color*/}
          <span
          >
            {copiedColor === color ? "¡Copiado!" : color}
          </span>{" "}
        </div>
      ))}
    </div>
  );
};
