import { useState, useEffect } from "react";

import {generatePalette} from '../../lib/colorUtils'
import type {Harmony} from "../../lib/colorUtils"

import {ColorInput} from './ColorInput'
import {PaletteDisplay} from './PaletteDisplay'

import { ContrastGrid } from "./ContrastGrid";


const PaletteTool = () => {
    const [baseColor, setBaseColor] = useState<string>('#3498db'); //Blue color as default
    const [harmony, setHarmony] = useState<Harmony>('analogous');
    const [palette, setPalette] = useState<string[]>([]);

    //This effect will run when the baseColor or harmony changes
    useEffect(() => {
        const newPalette = generatePalette(baseColor, harmony, 5);
        setPalette(newPalette);
        console.log(`generate new palette for ${baseColor} and harmony: ${harmony}`);

    }, [baseColor, harmony]);

     return (
    <div>
      <ColorInput
        baseColor={baseColor}
        harmony={harmony}
        onColorChange={setBaseColor}
        onHarmonyChange={setHarmony}
      />
      <PaletteDisplay colors={palette} />
      
      <div>
        <h3>WCAG contrast validation: </h3>
        <ContrastGrid palette={palette} />
      </div>
    </div>
  );
};
export default PaletteTool