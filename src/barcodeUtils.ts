/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Pure TypeScript Code 128 Barcode Generator (Type B)
// Generates an SVG string representation of a Code 128 barcode
export function generateCode128SvgPath(text: string): { path: string; width: number } {
  // Code 128 Type B encoding table
  const code128BPatterns: { [key: string]: string } = {
    ' ': '11011001100', '!': '11001101100', '"': '11001100110', '#': '10010011000',
    '$': '10010001100', '%': '10001001100', '&': '10011001000', "'": '10011000100',
    '(': '10001100100', ')': '11001001000', '*': '11001000100', '+': '11000100100',
    ',': '10110011100', '-': '10011011100', '.': '10011001110', '/': '10111001100',
    '0': '10011101100', '1': '10011100110', '2': '11001110110', '3': '11001110011',
    '4': '11001011100', '5': '11001001110', '6': '11000101110', '7': '11011101000',
    '8': '11011100010', '9': '11000111010', ':': '11010111000', ';': '11010001110',
    '<': '11000101110', '=': '11011101000', '>': '11011100010', '?': '11000111010',
    '@': '11010111000', 'A': '11010001110', 'B': '11000101110', 'C': '11101101100',
    'D': '11101100110', 'E': '11100110110', 'F': '11100110011', 'G': '11100101100',
    'H': '11100100110', 'I': '11100010110', 'J': '11100010011', 'K': '11101100100',
    'L': '11100110100', 'M': '11100110010', 'N': '11100011010', 'O': '11100101100',
    'P': '11100100110', 'Q': '11100010110', 'R': '11100010011', 'S': '11011011100',
    'T': '11011001110', 'U': '11001101110', 'V': '11011101100', 'W': '11011100110',
    'X': '11001110110', 'Y': '11001110011', 'Z': '11001011100', '[': '11001001110',
    '\\': '11000101110', ']': '11011101000', '^': '11011100010', '_': '11000111010',
    '`': '10101111000', 'a': '10100011110', 'b': '10001011110', 'c': '10111101000',
    'd': '10111100010', 'e': '10111100010', 'f': '11110101000', 'g': '11110100010',
    'h': '10111011110', 'i': '10111101110', 'j': '11101011110', 'k': '11110101110',
    'l': '11110111010', 'm': '11110111010', 'n': '11011111010', 'o': '11111011010',
    'p': '11111011010', 'q': '11111011010', 'r': '11011111010', 's': '11111011010',
    't': '11111011010', 'u': '11111101100', 'v': '11111100110', 'w': '11111100110',
    'x': '11111011010', 'y': '11111011010', 'z': '11111101100', '{': '11111100110',
    '|': '11111100110', '}': '11111011010', '~': '11111011010', 'DEL': '11000111010'
  };

  const startPattern = '11010010000'; // Start Code B (index 104)
  const stopPattern = '1100011101011'; // Stop Pattern (index 106 + stop bar)

  // Clean the text to representable values
  const cleanedText = text.replace(/[^\x20-\x7F]/g, '');

  // Calculate Check Digit
  // Code B Start is 104
  let checksum = 104;
  for (let i = 0; i < cleanedText.length; i++) {
    const char = cleanedText[i];
    const codeValue = char.charCodeAt(0) - 32;
    checksum += codeValue * (i + 1);
  }
  const checkDigitValue = checksum % 103;

  // Find pattern for check digit
  // Map index back to character or special pattern
  const codeBOrderedKeys = Object.keys(code128BPatterns);
  const checkPattern = code128BPatterns[codeBOrderedKeys[checkDigitValue]] || '11000111010';

  // Build overall bit string
  let bitString = startPattern;
  for (let i = 0; i < cleanedText.length; i++) {
    const char = cleanedText[i];
    bitString += code128BPatterns[char] || '11011001100'; // fallback space
  }
  bitString += checkPattern;
  bitString += stopPattern;

  // Convert bit string to SVG path rectangle bars
  let svgPath = '';
  const barWidth = 2; // px per narrow bar
  const height = 65; // px barcode height

  for (let i = 0; i < bitString.length; i++) {
    if (bitString[i] === '1') {
      const x = i * barWidth;
      svgPath += `M${x},0 L${x},${height} `;
    }
  }

  const totalWidth = bitString.length * barWidth;
  return { path: svgPath, width: totalWidth };
}

// Generate automatic Unique SKU Code based on Category select and existing SKUs list to avoid conflict
// Format: ALN-CEL-[0001-9999]
export function generateAutoSKU(category: string, existingSkus: string[]): string {
  let prefix = 'CEL';
  const cat = category.toLowerCase();
  
  if (cat.includes('short pants')) {
    prefix = 'CSP';
  } else if (cat.includes('rib')) {
    prefix = 'CRB';
  } else if (cat.includes('kids rib')) {
    prefix = 'CKR';
  } else if (cat.includes('kids')) {
    prefix = 'KDS';
  } else if (cat.includes('woolpeach') || cat.includes('wollycrape') || cat.includes('anak')) {
    prefix = 'JLB';
  }
  
  const skuSet = new Set((existingSkus || []).map(s => s.trim().toUpperCase()));
  let index = 1;
  let skuCandidate = `ALN-${prefix}-${String(index).padStart(4, '0')}`;
  
  while (skuSet.has(skuCandidate.toUpperCase())) {
    index++;
    skuCandidate = `ALN-${prefix}-${String(index).padStart(4, '0')}`;
  }
  
  return skuCandidate;
}
