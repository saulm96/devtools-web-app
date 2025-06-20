import chroma from "chroma-js";

export type Harmony = 'analogous' | 'triadic' | 'complementary' | 'monochrome' ;

export function generatePalette(baseColorHex: string, harmony: Harmony, count: number = 5) {
    if(!chroma.valid(baseColorHex)){
        return [baseColorHex]
    }

    const baseColor = chroma(baseColorHex);

  switch (harmony) {
    case 'monochrome':
      return chroma.scale([baseColor.darken(2.5), baseColor, baseColor.brighten(2.5)])
        .mode('lch').colors(count);

    case 'analogous':
      return chroma.scale([baseColor.set('hsl.h', '-30'), baseColor, baseColor.set('hsl.h', '+30')])
        .mode('lch').colors(count);
      
    case 'complementary':
      const complementaryColor = baseColor.set('hsl.h', '+180');
      return chroma.scale([baseColor, complementaryColor]).mode('lch').colors(count);

    case 'triadic':
      const color2 = baseColor.set('hsl.h', '+120');
      const color3 = baseColor.set('hsl.h', '+240');
      return chroma.scale([baseColor, color2, color3]).mode('lch').colors(count);

    default:
      // Por si acaso, devolvemos una paleta monocromática
      return chroma.scale(['black', baseColor, 'white']).mode('lch').colors(count);
  }
}

export default generatePalette;