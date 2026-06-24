export interface ColorPreset {
  name: string;
  hex: string;
  border?: boolean;
}

export const celamisRegularColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Coksu', hex: '#D2B48C' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Ungu Tua', hex: '#581C87' },
  { name: 'Toska', hex: '#0F766E' },
  { name: 'Plum Truffle', hex: '#4E2F4F' },
  { name: 'Magenta', hex: '#D946EF' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Hijau Army', hex: '#3F6212' },
  { name: 'Mint', hex: '#A7F3D0' }
];

export const celamisRibColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Maroon', hex: '#991B1B' }
];

export const celamisShortPantsColors: ColorPreset[] = [
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Ungu Muda', hex: '#E9D5FF' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Hijau Mint', hex: '#A7F3D0' },
  { name: 'Magenta', hex: '#D946EF' },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Coktu', hex: '#5C4033' }
];

export const celamisKidsColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Ungu Muda', hex: '#E9D5FF' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Hijau Mint', hex: '#A7F3D0' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Coksu', hex: '#D2B48C' }
];

export const celamisKidsRibColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Ungu Muda', hex: '#E9D5FF' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Hijau Mint', hex: '#A7F3D0' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Coksu', hex: '#D2B48C' }
];

export const jilbabWoolpeachColors: ColorPreset[] = [
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Milo', hex: '#A58B74' },
  { name: 'Hijau Army', hex: '#3F6212' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Abu abu', hex: '#9CA3AF' },
  { name: 'Tosca', hex: '#0F766E' },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Dark Lavender', hex: '#5E3A8C' },
  { name: 'Coklat tua', hex: '#3E2723' }
];

export const jilbabWollycrapeColors: ColorPreset[] = [
  { name: 'Hijau Army', hex: '#3F6212' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'OffWhite', hex: '#FAF9F6', border: true },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Abu abu', hex: '#9CA3AF' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Milo', hex: '#A58B74' },
  { name: 'Coklat susu', hex: '#D2B48C' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Lavender', hex: '#E9D5FF' },
  { name: 'Coklat tua', hex: '#3E2723' }
];

export const jilbabAnakColors: ColorPreset[] = [
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Light Cream', hex: '#FFFDD0', border: true },
  { name: 'Baby Pink', hex: '#FFD1DC' },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Abu abu', hex: '#9CA3AF' },
  { name: 'Biru langit', hex: '#87CEEB' },
  { name: 'Coklat susu', hex: '#D2B48C' },
  { name: 'Kuning', hex: '#FBBF24' },
  { name: 'merah', hex: '#EF4444' },
  { name: 'Magenta', hex: '#D946EF' },
  { name: 'Mint', hex: '#A7F3D0' }
];

export const getColorHexFromName = (colorName: string): string => {
  const name = (colorName || '').trim().toLowerCase();
  
  const allPresets = [
    ...celamisRegularColors,
    ...celamisRibColors,
    ...celamisShortPantsColors,
    ...celamisKidsColors,
    ...celamisKidsRibColors,
    ...jilbabWoolpeachColors,
    ...jilbabWollycrapeColors,
    ...jilbabAnakColors
  ];
  const found = allPresets.find(p => p.name.trim().toLowerCase() === name);
  if (found) return found.hex;

  if (name.includes('hitam') || name.includes('black')) return '#111827';
  if (name.includes('putih') || name.includes('white')) return '#FFFFFF';
  if (name.includes('navy') || name.includes('dongker')) return '#1E3A8A';
  if (name.includes('maroon') || name.includes('marun')) return '#991B1B';
  if (name.includes('pink') || name.includes('merah muda')) return '#FBCFE8';
  if (name.includes('peach')) return '#FDBA74';
  if (name.includes('mint')) return '#A7F3D0';
  if (name.includes('toska') || name.includes('tosca')) return '#0F766E';
  if (name.includes('abu') || name.includes('grey') || name.includes('gray')) return '#9CA3AF';
  if (name.includes('coklat') || name.includes('brown') || name.includes('coktu')) return '#5C4033';
  if (name.includes('coksu') || name.includes('susu')) return '#D2B48C';
  if (name.includes('army') || name.includes('tentara')) return '#3F6212';
  if (name.includes('ungu') || name.includes('purple') || name.includes('violet')) return '#8B5CF6';
  if (name.includes('hijau') || name.includes('green')) return '#10B981';
  if (name.includes('kuning') || name.includes('yellow')) return '#F59E0B';
  if (name.includes('orange') || name.includes('jingga')) return '#F97316';
  if (name.includes('merah') || name.includes('red')) return '#EF4444';
  if (name.includes('salmon')) return '#FDA4AF';
  if (name.includes('magenta')) return '#D946EF';
  if (name.includes('plum')) return '#4E2F4F';
  if (name.includes('cream') || name.includes('krem')) return '#FEF3C7';
  if (name.includes('muda')) return '#DDD6FE';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 75%, 75%)`;
};

export const getColorsByCategory = (cat: string): ColorPreset[] => {
  const c = cat || '';
  switch (c) {
    case 'Celamis Regular':
      return celamisRegularColors;
    case 'Celamis Rib':
      return celamisRibColors;
    case 'Celamis Short Pants':
      return celamisShortPantsColors;
    case 'Celamis Kids':
      return celamisKidsColors;
    case 'Celamis Kids Rib':
      return celamisKidsRibColors;
    case 'Jilbab Woolpeach Pad':
    case 'Jilbab Woolpeach Softpad':
      return jilbabWoolpeachColors;
    case 'Jilbab Wollycrepe Pad':
    case 'Jilbab Wollycrepe Softpad':
      return jilbabWollycrapeColors;
    case 'Jilbab Anak':
      return jilbabAnakColors;
    default:
      return celamisRegularColors;
  }
};

export const getVariantsByCategory = (cat: string): string[] => {
  const c = cat || '';
  switch (c) {
    case 'Celamis Regular':
    case 'Celamis Rib':
    case 'Celamis Short Pants':
      return ['All Size', 'Jumbo', 'Ekstra Jumbo'];
    case 'Celamis Kids':
    case 'Celamis Kids Rib':
      return ['Kids 1', 'Kids 2', 'Kids 3'];
    case 'Jilbab Woolpeach Pad':
    case 'Jilbab Woolpeach Softpad':
    case 'Jilbab Wollycrepe Pad':
    case 'Jilbab Wollycrepe Softpad':
      return ['M', 'L', 'XL'];
    case 'Jilbab Anak':
      return ['Jilbab Anak 1', 'Jilbab Anak 2', 'Jilbab Anak 3'];
    default:
      return ['All Size'];
  }
};

export function getProductPriceFromSchema(category: string, variant: string, channel: string, fallbackPrice: number): number {
  const cat = category || '';
  const catLower = cat.toLowerCase();
  const isRib = catLower.includes('rib');
  const isKids = catLower.includes('kids') || catLower.includes('anak');

  const vName = variant || '';
  let v = vName.toLowerCase().replace(/\s+/g, '');
  if (v === 'allsize' || v === 'all_size') v = 'allsize';
  else if (v === 'jumbo') v = 'jumbo';
  else if (v === 'ekstrajumbo' || v === 'extrajumbo') v = 'ekstrajumbo';
  else if (v === 'kids1' || v === 'jilbabanak1' || v === 'anak1') v = 'kids1';
  else if (v === 'kids2' || v === 'jilbabanak2' || v === 'anak2') v = 'kids2';
  else if (v === 'kids3' || v === 'jilbabanak3' || v === 'anak3') v = 'kids3';
  else if (v === 'm') v = 'allsize';
  else if (v === 'l') v = 'jumbo';
  else if (v === 'xl') v = 'ekstrajumbo';

  const chName = channel || '';
  let channelType: 'ecer' | 'marketer' | 'reseller' | 'agen' | 'distributor' = 'ecer';
  const cLower = chName.toLowerCase();
  if (cLower.includes('marketer')) channelType = 'marketer';
  else if (cLower.includes('reseller')) channelType = 'reseller';
  else if (cLower.includes('agen')) channelType = 'agen';
  else if (cLower.includes('distributor')) channelType = 'distributor';
  else channelType = 'ecer';

  if (!isKids) {
    if (channelType === 'ecer') {
      if (isRib) {
        if (v === 'allsize') return 90000;
        if (v === 'jumbo') return 95000;
        if (v === 'ekstrajumbo') return 105000;
      } else {
        if (v === 'allsize') return 85000;
        if (v === 'jumbo') return 90000;
        if (v === 'ekstrajumbo') return 97500;
      }
    } else {
      if (isRib) {
        if (v === 'allsize') {
          if (channelType === 'marketer') return 75000;
          if (channelType === 'reseller') return 62500;
          if (channelType === 'agen') return 55000;
          if (channelType === 'distributor') return 47500;
        }
        if (v === 'jumbo') {
          if (channelType === 'marketer') return 80000;
          if (channelType === 'reseller') return 67500;
          if (channelType === 'agen') return 60000;
          if (channelType === 'distributor') return 52500;
        }
        if (v === 'ekstrajumbo') {
          if (channelType === 'marketer') return 87500;
          if (channelType === 'reseller') return 72500;
          if (channelType === 'agen') return 65000;
          if (channelType === 'distributor') return 57500;
        }
      } else {
        if (v === 'allsize') {
          if (channelType === 'marketer') return 70000;
          if (channelType === 'reseller') return 57500;
          if (channelType === 'agen') return 50000;
          if (channelType === 'distributor') return 42500;
        }
        if (v === 'jumbo') {
          if (channelType === 'marketer') return 75000;
          if (channelType === 'reseller') return 62500;
          if (channelType === 'agen') return 55000;
          if (channelType === 'distributor') return 47500;
        }
        if (v === 'ekstrajumbo') {
          if (channelType === 'marketer') return 82500;
          if (channelType === 'reseller') return 67500;
          if (channelType === 'agen') return 60000;
          if (channelType === 'distributor') return 52500;
        }
      }
    }
  } else {
    if (channelType === 'ecer') {
      if (isRib) {
        if (v === 'kids1') return 70000;
        if (v === 'kids2') return 75000;
        if (v === 'kids3') return 80000;
      } else {
        if (v === 'kids1') return 65000;
        if (v === 'kids2') return 70000;
        if (v === 'kids3') return 75000;
      }
    } else {
      if (isRib) {
        if (v === 'kids1') {
          if (channelType === 'marketer') return 55500;
          if (channelType === 'reseller') return 48000;
          if (channelType === 'agen') return 41500;
          if (channelType === 'distributor') return 35000;
        }
        if (v === 'kids2') {
          if (channelType === 'marketer') return 60000;
          if (channelType === 'reseller') return 52500;
          if (channelType === 'agen') return 45000;
          if (channelType === 'distributor') return 37500;
        }
        if (v === 'kids3') {
          if (channelType === 'marketer') return 65000;
          if (channelType === 'reseller') return 55500;
          if (channelType === 'agen') return 48000;
          if (channelType === 'distributor') return 41500;
        }
      } else {
        if (v === 'kids1') {
          if (channelType === 'marketer') return 52500;
          if (channelType === 'reseller') return 45000;
          if (channelType === 'agen') return 38500;
          if (channelType === 'distributor') return 32500;
        }
        if (v === 'kids2') {
          if (channelType === 'marketer') return 55000;
          if (channelType === 'reseller') return 47500;
          if (channelType === 'agen') return 41500;
          if (channelType === 'distributor') return 35000;
        }
        if (v === 'kids3') {
          if (channelType === 'marketer') return 60000;
          if (channelType === 'reseller') return 52500;
          if (channelType === 'agen') return 46500;
          if (channelType === 'distributor') return 39000;
        }
      }
    }
  }

  return fallbackPrice;
}

const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in ms

export const categoryList = [
  "Celamis Regular",
  "Celamis Rib",
  "Celamis Short Pants",
  "Celamis Kids",
  "Celamis Kids Rib",
  "Jilbab Woolpeach Pad",
  "Jilbab Wollycrepe Pad",
  "Jilbab Woolpeach Softpad",
  "Jilbab Wollycrepe Softpad",
  "Jilbab Anak"
];

