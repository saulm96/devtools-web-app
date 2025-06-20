// src/components/ContrastGrid.tsx
import React, { useState } from "react";
import chroma from "chroma-js";

// Sub-componente también sin estilos, usando clases condicionales
const ContrastResult = ({ ratio }: { ratio: number }) => {
  const WCAG_AA_RATIO = 4.5;
  const WCAG_AAA_RATIO = 7;
  const aaPass = ratio >= WCAG_AA_RATIO;
  const aaaPass = ratio >= WCAG_AAA_RATIO;

  const passColor = "#27ae60";
  const failColor = "#c0392b";

  return (
    <div className="contrast-result">
      <div className="contrast-ratio">{ratio.toFixed(2)}:1</div>
      <div className="contrast-levels">
        <span
          style={{ color: aaPass ? passColor : failColor, fontWeight: "bold" }}
        >
          AA
        </span>
        {" / "}
        <span
          style={{ color: aaaPass ? passColor : failColor, fontWeight: "bold" }}
        >
          AAA
        </span>
      </div>
    </div>
  );
};

export const ContrastGrid = ({ palette }: { palette: string[] }) => {
  const [customTextColor, setCustomTextColor] = useState("#333333");

  const textColors = [
    { name: "Negro", hex: "#000000" },
    { name: "Blanco", hex: "#FFFFFF" },
    { name: "Personalizado", hex: customTextColor },
  ];

  return (
    <div className="contrast-validator">
      <div className="custom-color-tester">
        <label htmlFor="custom-text-color">
          Probar con un color de texto personalizado:
        </label>
        <div className="input-group">
          <input
            type="color"
            id="custom-text-color"
            className="color-picker-visual"
            value={chroma.valid(customTextColor) ? customTextColor : "#000000"}
            onChange={(e) => setCustomTextColor(e.target.value)}
          />
          <input
            type="text"
            className="color-picker-text"
            value={customTextColor}
            onChange={(e) => setCustomTextColor(e.target.value)}
          />
          <div
            className="color-swatch"
            style={{
              backgroundColor: chroma.valid(customTextColor)
                ? customTextColor
                : "transparent",
            }}
          ></div>
        </div>
      </div>

      <table className="contrast-grid-table">
        <thead>
          <tr>
            <th>Color de Fondo</th>
            {textColors.map((tc) => (
              <th key={tc.name}>
                Texto {tc.name}
                {tc.name === "Personalizado" && (
                  <code className="color-code"
                  >({tc.hex})</code>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {palette.map((bgColor) => (
            <tr key={bgColor}>
              <td>
                <div
                  className="color-row-minimal"
                  style={{ backgroundColor: bgColor }}
                >
                  <div className="color-swatch-small"></div>
                  <code
                  style={{color:customTextColor}}>{bgColor}</code>
                </div>
              </td>
              {textColors.map((textColor) => {
                if (!chroma.valid(bgColor) || !chroma.valid(textColor.hex)) {
                  return (
                    <td
                      key={`${bgColor}-${textColor.hex}`}
                      className="cell-error"
                    >
                      Color inválido
                    </td>
                  );
                }
                const contrast = chroma.contrast(bgColor, textColor.hex);
                return (
                  <td key={`${bgColor}-${textColor.hex}`}>
                    <ContrastResult ratio={contrast} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
