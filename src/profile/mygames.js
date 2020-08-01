import '../base.css';
import '../template/template';

const allMatches = [];
const selectedMatches = new Set();

const domMaps = {
  playerName: [1, 2].map((i) => document.getElementById(`p${i}name`)),
  character: [1, 2].map((i) => document.getElementById(`p${i}char`)),
  place: [1, 2].map((i) => document.getElementById(`p${i}place`)),
};

// correctly renders the editor grid when matches have been selected
const updatedEditor = () => {
  const editor = document.getElementById('editor');
  if (selectedMatches.size === 0) {
    return editor.classList.add('hidden');
  }

  // populate default values
  for (const [attr, doms] of Object.entries(domMaps)) {
    for (const [i, dom] of doms.entries()) {
      const defState = new Set(
        [...selectedMatches]
          .filter(({ players }) => players.length >= i + 1)
          .map(({ players }) => players[i][attr]),
      );

      if (defState.size === 1) {
        [dom.value] = defState;
      } else {
        dom.value = '';
      }
    }
  }

  const error = document.getElementById('matchError');
  const defError = new Set([...selectedMatches].map((g) => g.error));
  if (defError.has('false') || defError.has(false)) {
    error.classList.add('hidden');
  } else {
    error.innerText = `Error: ${defError.values().next().value}`;
    error.classList.remove('hidden');
  }

  return editor.classList.remove('hidden');
};

// populates the gallery with matches. this is done when a new filter is applied
// or a match has been updated/edited.
const renderMatches = (matches) => {
  const gallery = document.getElementById('gallery');
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const imgwidth = (gallery.offsetWidth - 3 * 5) / 3 > 200
    ? (gallery.offsetWidth - 3 * 5) / 3
    : 200;

  // dynamically determine the number of items that can be fit
  const nCols = Math.floor(gallery.offsetWidth / imgwidth);
  const nRows = Math.floor((document.getElementById('navcontainer').offsetHeight * 0.8 - document.getElementById('pagetitle').offsetHeight) / (imgwidth * 0.5));
  const nItems = nCols * nRows;

  const total = new Set([...matches.slice(0, nItems), ...allMatches]);
  for (const match of total) {
    if (!matches.includes(match)) {
      // delete node
      allMatches.splice(allMatches.indexOf(match), 1);
      selectedMatches.delete(match);
      document.getElementById(match.hash).remove();
    } else if (!allMatches.includes(match)) {
      allMatches.push(match);

      // append match
      const div = document.createElement('div');
      div.id = match.hash;
      div.style.width = `${imgwidth}px`;
      div.classList.add('p-2');
      div.innerHTML += `<img src="${match.image}" loading="lazy" class='cursor-pointer' width="${imgwidth - 2 * 0.5 * rem}px">`;
      gallery.appendChild(div);

      div.querySelector('img').addEventListener('click', (e) => {
        const border = ['border-blue-500', 'border-4'];
        if (selectedMatches.has(match)) {
          selectedMatches.delete(match);
          e.target.classList.remove(...border);

          // add styling to match if it is an error
          if (match.error !== 'false' && match.error !== false) {
            div.children[0].classList.add('border-red-500', 'border-4');
          }
        } else {
          selectedMatches.add(match);
          e.target.classList.add(...border);
        }

        updatedEditor();
      });

      // add styling to match if it is an error
      if (match.error !== 'false' && match.error !== false) {
        div.children[0].classList.add('border-red-500', 'border-4');
      }
    }
  }

  updatedEditor();
};

const reset = () => Promise.all([
  import(
    /* webpackPreload: true */
    /* webpackPrefetch: true */
    /* webpackChunkName: "crossfilter2" */
    'crossfilter2'
  ),
  import(
    /* webpackPreload: true */
    /* webpackPrefetch: true */
    /* webpackChunkName: "request" */
    '../lib/request'
  ),
  import(
    /* webpackPreload: true */
    /* webpackPrefetch: true */
    /* webpackChunkName: "players" */
    '../lib/players'
  ),
])
  .then(([{ default: Crossfilter }, { get }, { names }]) => {
    const crossfilter = Crossfilter([]);

    // define dimensions
    const errorDim = crossfilter.dimension((d) => d.error !== 'false' && d.error !== false);
    const hashDim = crossfilter.dimension((d) => d.hash);
    const charactersDim = crossfilter.dimension((d) => d.characters.map((c) => c.character), true);
    const characterVolDim = crossfilter
      .dimension((d) => d.characters.map((c) => c.character), true);

    // updates the count of matches in the span tag
    const inputCount = (nodeElem, amount) => {
      const node = nodeElem;
      node.nextElementSibling.querySelector('span').innerText = amount;
    };

    // update function for when a character is selected
    const characters = new Set();
    const node = document.getElementById('errorFilter');
    const updateFilterCounts = () => {
      if (characters.size > 0) {
        charactersDim.filter((c) => characters.has(c));
      } else {
        charactersDim.filterAll();
      }

      inputCount(node, ...errorDim.group().top(Infinity)
        .filter((e) => e.key === true).map((e) => e.value));
      for (const { key: character, value } of characterVolDim.group().top(Infinity)) {
        const inputNode = document.getElementById(`${character}Filter`);
        if (value > 0) {
          inputNode.parentElement.classList.remove('hidden');
          inputCount(inputNode, value);
        } else if (value === 0 && (!inputNode.parentElement.classList.contains('hidden'))) {
          inputNode.parentElement.classList.add('hidden');
        }
      }

      renderMatches(hashDim.top(Infinity));
    };

    // update function for when error is targeted
    node.addEventListener('change', (e) => {
      errorDim.filter(e.target.checked ? true : null);
      updateFilterCounts();
    });

    return get('/api/ultimate/profile/games')
      .then((matches) => {
        crossfilter.add(matches);
        renderMatches(hashDim.top(Infinity));

        // update filter counts
        const listParent = node.parentElement.parentElement;
        inputCount(node, ...errorDim.group().top(Infinity)
          .filter((e) => e.key === true).map((e) => e.value));
        for (const character of charactersDim.group().top(Infinity)) {
          const test = document.getElementById(`${character.key}Filter`);
          if (!(test instanceof HTMLElement)) {
            const div = document.createElement('div');

            const input = document.createElement('input');
            input.id = `${character.key}Filter`;
            input.classList.add('cursor-pointer');
            input.type = 'checkbox';
            input.checked = false;

            const label = document.createElement('label');
            label.classList.add('cursor-pointer', 'ml-1');
            label.setAttribute('for', input.id);
            label.innerHTML = `${names[character.key]} (<span>${character.value}</span>)`;

            div.appendChild(input);
            div.appendChild(label);
            listParent.appendChild(div);

            input.addEventListener('change', (e) => {
              if (e.target.checked) {
                characters.add(character.key);
              } else {
                characters.delete(character.key);
              }

              updateFilterCounts();
            });
          }
        }

        // unselect all checkboxes
        for (const nodeElem of listParent.querySelectorAll('input')) {
          nodeElem.checked = false;
        }
      })
      .then(() => updateFilterCounts());
  });
reset();

import(
  /* webpackPreload: true */
  /* webpackPrefetch: true */
  /* webpackChunkName: "players" */
  '../lib/players'
)
  .then(({ names }) => domMaps.character
    .forEach((node) => Object.entries(names).forEach(([value, text]) => {
      const option = document.createElement('option');
      option.value = value;
      option.innerText = text;
      node.appendChild(option);
    })));

// handle deletion and saving of games
import(
  /* webpackPreload: true */
  /* webpackPrefetch: true */
  /* webpackChunkName: "request" */
  '../lib/request'
)
  .then(({ post }) => {
    document.getElementById('save').addEventListener('click', () => Promise.all(
      [...selectedMatches].map((game) => {
        const image = { ...game };

        // setup defaults
        if (!image.players || image.players.length > 2) image.players = [];
        if (!image.characters || image.characters.length > 2) image.characters = [];
        if (image.players.length < 2) {
          for (let i = 0; i < 2 - image.players.length; i += 1) {
            image.players.push({ playerName: '', place: 1, character: '' });
          }
        }
        if (image.characters.length < 2) {
          for (let i = 0; i < 2 - image.characters.length; i += 1) {
            image.characters.push({ place: 1, character: '' });
          }
        }

        // apply attributes from editor
        for (const [attribute, doms] of Object.entries(domMaps)) {
          for (const [i, dom] of doms.entries()) {
            if (dom.value && dom.value !== '' && dom.value.length > 0) {
              image.players[i][attribute] = (attribute === 'place') ? parseInt(dom.value, 10) : dom.value;
              image.characters[i][attribute] = (attribute === 'place') ? parseInt(dom.value, 10) : dom.value;
            }
          }
        }

        return post('/api/ultimate/profile/saveGame', { image });
      }),
    )
      .then(() => reset()));

    document.getElementById('delete').addEventListener('click', () => Promise.all(
      [...selectedMatches]
        .map((image) => post('/api/ultimate/profile/delete', { image })),
    ).then(() => reset()));
  });
