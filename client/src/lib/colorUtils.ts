// src/lib/colorUtils.ts
import chroma from 'chroma-js';

export type Harmony = 'analogous' | 'monochromatic' | 'complementary' | 'triadic';

export function generatePalette(baseColorHex: string, harmony: Harmony, count: number = 5): string[] {
  if (!chroma.valid(baseColorHex)) {
    return [baseColorHex];
  }

  const baseColor = chroma(baseColorHex);
  let palette: string[] = [];

  switch (harmony) {
    case 'monochromatic':
      palette = chroma.scale([baseColor.darken(2.5), baseColor, baseColor.brighten(2.5)])
        .mode('lch').colors(count);
      break;

    case 'analogous':
      palette = chroma.scale([baseColor.set('hsl.h', '-30'), baseColor, baseColor.set('hsl.h', '+30')])
        .mode('lch').colors(count);
      break;
      
    case 'complementary':
      const complementaryColor = baseColor.set('hsl.h', '+180');
      palette = chroma.scale([baseColor, complementaryColor]).mode('lch').colors(count);
      break;

    case 'triadic':
      const color2 = baseColor.set('hsl.h', '+120');
      const color3 = baseColor.set('hsl.h', '+240');
      palette = chroma.scale([baseColor, color2, color3]).mode('lch').colors(count);
      break;

    default:
      palette = [baseColor.hex()];
      break;
  }


  return [...new Set(palette)];
}