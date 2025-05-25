/**
 * Преобразует hex-цвет в { r, g, b, a }  и/или в строку  "rgba(r, g, b, a)".
 * @param hex   #fff | #ffffff | #ffff | #ffffffff
 * @param toCss вернуть строку "rgba(...)" вместо объекта
 */
export function hexToRgb(hex: string, toCss = true) {
  // убираем решётку, приводим к нижнему регистру
  hex = hex.replace(/^#/, '').toLowerCase();

  // #rgb или #rgba → #rrggbb[aa]
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split('')
      .map((ch) => ch + ch)
      .join('');
  }

  if (!(hex.length === 6 || hex.length === 8)) {
    throw new Error('Неверный формат hex-цвета');
  }

  const num = parseInt(hex, 16);

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const a = hex.length === 8 ? ((num >> 24) & 255) / 255 : 1;
  // ${Number(a.toFixed(3))}
  if (toCss) {
    return `${r}, ${g}, ${b}`;
  }

  return { r, g, b, a };
}
