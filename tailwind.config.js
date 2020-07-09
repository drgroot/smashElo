/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');

// plugins
const gradients = require('./tailwind/plugin.gradients');

const extensions = ['.html', '.pug', '.ejs'];
const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      const f = getAllFiles(path.join(dirPath, file));
      for (const i of f) {
        arrayOfFiles.push(i);
      }
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
};

module.exports = {
  purge: {
    enabled: (process.env.NODE_ENV === 'production'),
    mode: 'all',
    content: getAllFiles('./src').filter((f) => extensions.includes(path.extname(f))),
  },
  theme: {
    colors: {
      red: {
        100: '#FDE6E7',
        200: '#F9BFC4',
        300: '#F599A0',
        400: '#EE4D59',
        500: '#E60012',
        600: '#CF0010',
        700: '#8A000B',
        800: '#680008',
        900: '#450005',
      },
      black: {
        100: '#E6E6E6',
        200: '#C0C0C0',
        300: '#999999',
        400: '#4D4D4D',
        500: '#010101',
        600: '#010101',
        700: '#010101',
        800: '#000000',
        900: '#000000',
      },
      gray: {
        100: '#FDFDFD',
        200: '#FBFBFB',
        300: '#F8F8F8',
        400: '#F3F3F3',
        500: '#EEEEEE',
        600: '#D6D6D6',
        700: '#8F8F8F',
        800: '#6B6B6B',
        900: '#474747',
      },
      white: {
        100: '#FEFEFF',
        200: '#FEFDFE',
        300: '#FDFCFD',
        400: '#FBFAFC',
        500: '#F9F8FA',
        600: '#E0DFE1',
        700: '#959596',
        800: '#707071',
        900: '#4B4A4B',
      },
      orange: {
        100: '#FFF2E9',
        200: '#FEDFC8',
        300: '#FDCCA6',
        400: '#FCA564',
        500: '#FA7F21',
        600: '#E1721E',
        700: '#964C14',
        800: '#71390F',
        900: '#4B260A',
      },
    },
  },
  variants: {},
  plugins: [gradients],
};
