const padZero = (str, len = 2) => {
  const zeros = new Array(len).join('0');
  return (`${zeros}${str}`).slice(-len);
};

const hexToRGB = (color) => {
  if (color.indexOf(',') > -1) {
    return color.replace(/[^\d,]+/g, '').split(',').map((c) => parseInt(c, 10));
  }

  let hex = color;
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }

  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }

  return [
    parseInt(hex.slice(0, 2), 16), // r
    parseInt(hex.slice(2, 4), 16), // g
    parseInt(hex.slice(4, 6), 16), // b
  ];
};

const rgbToHex = (rgbArray) => {
  const a = [];
  for (const r of rgbArray) {
    a.push(padZero(r).toString(16));
  }
  return `#${a.join('')}`;
};

// http://stackoverflow.com/a/3943023/112731
const getLuminance = (c) => {
  const a = []; // so we don't mutate
  for (let i = 0; i < c.length; i += 1) {
    const x = c[i] / 255;
    a[i] = x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  }
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

const invertColor = (color, bw = true) => {
  const input = (typeof color === 'string') ? hexToRGB(color) : [...color];

  if (bw) {
    const threshold = Math.sqrt(1.05 * 0.05) - 0.05;
    return (getLuminance(input) > threshold) ? 'black' : '#FFFFFF';
  }

  return rgbToHex(input.map((c) => 255 - c));
};

export default invertColor;
