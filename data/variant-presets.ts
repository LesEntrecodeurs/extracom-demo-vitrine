/**
 * Aide au rendu des axes de déclinaison : détermine si un axe est de type
 * « couleur » ou « taille » (le kit ne porte pas cette information — elle est
 * déduite du libellé de l'axe, en français et en anglais).
 */

export type AxisKind = 'color' | 'size' | 'text';

const COLOR_KEYWORDS = [
  'couleur',
  'color',
  'colour',
  'coloris'
];

const SIZE_KEYWORDS = [
  'taille',
  'size',
  'pointure',
  'dimension',
  'calibre'
];

export function getAxisKind(label: string): AxisKind {
  const l = label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (COLOR_KEYWORDS.some((k) => l.includes(k))) return 'color';
  if (SIZE_KEYWORDS.some((k) => l.includes(k))) return 'size';
  return 'text';
}

/**
 * Libellés couleur (FR + EN) vers leur code hex approximatif.
 * Couvre les teintes courantes en habillement / déco. Pour les libellés
 * composés (« bleu marine », « rouge vif »), on teste d'abord l'expression
 * entière, puis mot par mot, en normalisant les accents.
 */
const COLOR_HEX: Record<string, string> = {
  noir: '#111827',
  black: '#111827',
  blanc: '#ffffff',
  white: '#ffffff',
  gris: '#9ca3af',
  grey: '#9ca3af',
  gray: '#9ca3af',
  anthracite: '#374151',
  beige: '#d6c7a8',
  sable: '#d6c7a8',
  creme: '#efe7d2',
  cream: '#efe7d2',
  ivoire: '#efe7d2',
  ivory: '#efe7d2',
  ecru: '#efe7d2',
  marron: '#6b4423',
  brown: '#6b4423',
  chocolat: '#6b4423',
  chocolate: '#6b4423',
  cafe: '#6b4423',
  coffee: '#6b4423',
  camel: '#c19a6b',
  taupe: '#a89078',
  terracotta: '#c97b5a',
  brique: '#a04432',
  rouge: '#dc2626',
  red: '#dc2626',
  bordeaux: '#7f1d1d',
  wine: '#7f1d1d',
  rose: '#f9a8d4',
  pink: '#f9a8d4',
  fuchsia: '#c026d3',
  magenta: '#c026d3',
  corail: '#fb7185',
  coral: '#fb7185',
  orange: '#f97316',
  jaune: '#facc15',
  yellow: '#facc15',
  moutarde: '#ca8a04',
  mustard: '#ca8a04',
  or: '#d4af37',
  gold: '#d4af37',
  dore: '#d4af37',
  golden: '#d4af37',
  vert: '#16a34a',
  green: '#16a34a',
  olive: '#84cc16',
  kaki: '#6b7c32',
  menthe: '#6ee7b7',
  mint: '#6ee7b7',
  turquoise: '#14b8a6',
  cyan: '#06b6d4',
  'bleu marine': '#1e3a8a',
  marine: '#1e3a8a',
  navy: '#1e3a8a',
  'bleu ciel': '#38bdf8',
  ciel: '#38bdf8',
  sky: '#38bdf8',
  bleu: '#2563eb',
  blue: '#2563eb',
  lavande: '#c4b5fd',
  lavender: '#c4b5fd',
  violet: '#7c3aed',
  purple: '#7c3aed',
  prune: '#581c87',
  argent: '#c0c0c0',
  silver: '#c0c0c0'
};

export function getColorHex(label: string): string | null {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const full = norm(label);
  if (COLOR_HEX[full]) return COLOR_HEX[full];

  const words = full.split(/\s+/);
  for (const word of words) {
    if (COLOR_HEX[word]) return COLOR_HEX[word];
  }
  return null;
}

/**
 * Heuristique de luminance perçue : détermine si une couleur de pastille est
 * assez claire pour qu'une bordure soit nécessaire à sa visibilité.
 */
export function isLightHex(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 200;
}