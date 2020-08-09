import '../base.css';
import '../template/template';

const allMatches = [];
const selectedMatches = new Set();

// set height of page
const pageContent = document.getElementById('page-content');
document.getElementById('content').style.height = `${pageContent.offsetHeight - pageContent.children[0].offsetHeight}px`;

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

// creates pagination browser
const binds = [];
let tmpMatches = null;
const generatePaginator = (matches, nItems, activePage) => {
  const pages = Math.ceil(matches.length / nItems);
  const paginator = document.getElementById('paginator');

  const visiblePages = new Set();
  for (let i = 0; i < 5; i += 1) {
    // check left side
    if (activePage - i > 0) {
      visiblePages.add(activePage - i);
    }

    // check right side
    if (activePage + i < pages) {
      visiblePages.add(activePage + i);
    }
  }

  const activePages = Array.from(paginator.children);
  if (tmpMatches !== matches) {
    tmpMatches = matches;

    // render view
    const outer = activePages.length > pages ? activePages.length : pages;
    for (let i = 0; i < outer; i += 1) {
      // check if node exists and modify it
      if (activePages[i] instanceof HTMLElement) {
        // remove event listener
        activePages[i].removeEventListener('click', binds[i]);
        binds[i] = null;

        // if the page is greater than number of pages, remove it
        if (i > pages) {
          paginator.removeChild(activePages[i]);
        }
      }

      if (i < pages) {
        // create node if not there
        if (i >= activePages.length || (!(activePages[i] instanceof HTMLElement))) {
          const node = document.createElement('div');
          node.innerText = i + 1;
          node.classList.add('ml-1', 'cursor-pointer');
          paginator.appendChild(node);
          activePages[i] = node;
        }

        // eslint-disable-next-line no-use-before-define
        binds[i] = () => renderMatches(matches, i);
        activePages[i].addEventListener('click', binds[i]);

        // control selection
        if (i === activePage) {
          activePages[i].classList.remove('text-blue-500');
          activePages[i].classList.add('text-red-500');
        } else {
          activePages[i].classList.remove('text-red-500');
          activePages[i].classList.add('text-blue-500', 'hover:text-red-400');
        }

        // control visibility
        if (visiblePages.has(i)) {
          activePages[i].classList.remove('hidden');
        } else {
          activePages[i].classList.add('hidden');
        }
      }
    }
  } else {
    for (const [i, node] of activePages.entries()) {
      if (visiblePages.has(i)) {
        node.classList.remove('hidden');
      } else {
        node.classList.add('hidden');
      }

      if (node.classList.contains('text-red-500') && i !== activePage) {
        node.classList.remove('text-red-500');
        node.classList.add('text-blue-500');
      } else if (i === activePage) {
        node.classList.remove('text-blue-500');
        node.classList.add('text-red-500');
      }
    }
  }
};

// populates the gallery with matches. this is done when a new filter is applied
// or a match has been updated/edited.
const renderMatches = (matches, page = 0) => {
  const gallery = document.getElementById('gallery');
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const imgwidth = (gallery.offsetWidth - 3 * 5) / 3 > 200
    ? (gallery.offsetWidth - 3 * 5) / 3
    : 200;

  // dynamically determine the number of items that can be fit
  const nCols = Math.floor(gallery.offsetWidth / imgwidth);
  const nRows = Math.floor((document.getElementById('content').offsetHeight * 0.8) / (imgwidth * 0.5));
  const nItems = nCols * nRows;

  const pageMatches = matches.slice(page * nItems, (page + 1) * nItems);
  const total = new Set([...pageMatches, ...allMatches]);
  for (const match of total) {
    if (!pageMatches.includes(match)) {
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
          e.target.classList.remove('border-red-500');
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
  generatePaginator(matches, nItems, page);
};

const hideMenuItems = (e) => {
  const hidden = e.target.children[0].classList.contains('-rotate-90');
  const fun = (f) => ((!hidden) ? f.classList.add('hidden') : f.classList.remove('hidden'));
  if (hidden) {
    e.target.children[0].classList.remove('-rotate-90');
  } else {
    e.target.children[0].classList.add('-rotate-90');
  }

  for (const input of e.target.parentNode.children) {
    if (input !== e.target) {
      fun(input);
    }
  }
};

Promise.all([
  import(
    /* webpackPrefetch: true */
    /* webpackChunkName: "crossfilter2" */
    'crossfilter2'
  ),
  import(
    /* webpackPreload: true */
    /* webpackPrefetch: true */
    /* webpackChunkName: "request" */
    '../lib/request'
  )
    .then(({ get }) => get('/api/ultimate/profile/games')),
  import(
    /* webpackPreload: true */
    /* webpackPrefetch: true */
    /* webpackChunkName: "players" */
    '../lib/players'
  ),
])
  .then(([{ default: Crossfilter }, matches, { names }]) => {
    const crossfilter = Crossfilter(matches);

    // define dimensions
    const errorDim = crossfilter.dimension((d) => d.error !== 'false' && d.error !== false);
    const hashDim = crossfilter.dimension((d) => d.hash);
    const charactersDim = crossfilter.dimension((d) => d.characters.map((c) => c.character), true);
    const playerDim = crossfilter.dimension((d) => d.players.map((p) => p.playerName), true);
    const characterVolDim = crossfilter
      .dimension((d) => d.characters.map((c) => c.character), true);
    const playerVolDim = crossfilter.dimension((d) => d.players.map((p) => p.playerName), true);

    // updates the count of matches in the span tag
    const inputCount = (nodeElem, amount = 0) => {
      const node = nodeElem;
      node.nextElementSibling.querySelector('span').innerText = amount;
    };

    // update function for when a character is selected
    const characters = new Set();
    const playerNames = new Set();
    const node = document.getElementById('errorFilter');
    const updateFilterCounts = (changed = null) => {
      if (changed === characters) {
        if (characters.size > 0) {
          charactersDim.filter((c) => characters.has(c));
        } else {
          charactersDim.filterAll();
        }
      }

      if (changed === playerNames) {
        if (playerNames.size > 0) {
          playerDim.filter((p) => playerNames.has(p));
        } else {
          playerDim.filterAll();
        }
      }

      // update filter counts on error
      inputCount(node, ...errorDim.group().top(Infinity)
        .filter((e) => e.key === true).map((e) => e.value));

      // update filter counts on characters
      for (const { key: character, value } of characterVolDim.group().top(Infinity)) {
        const inputNode = document.getElementById(`${character}Filter`);
        if (value > 0) {
          inputNode.parentElement.classList.remove('hidden');
          inputCount(inputNode, value);
        } else if (value === 0 && (!inputNode.parentElement.classList.contains('hidden'))) {
          inputNode.parentElement.classList.add('hidden');
        }
      }

      // update filter counts on players
      for (const { key: player, value } of playerVolDim.group().top(Infinity)) {
        const inputNode = document.getElementById(`p${player}Filter`);
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
    node.parentElement.parentElement.style.height = `${document.getElementById('content').offsetHeight * 0.95}px`;
    node.addEventListener('change', (e) => {
      errorDim.filter(e.target.checked ? true : null);
      updateFilterCounts();
    });
    node.checked = false;

    // update filter counts
    const characterList = document.getElementById('characterNames');
    const dropCharacter = characterList.children[0];
    dropCharacter.classList.remove('-rotate-90');
    dropCharacter.addEventListener('click', hideMenuItems);
    for (const character of charactersDim.group().top(Infinity)) {
      const test = document.getElementById(`${character.key}Filter`);
      if (!(test instanceof HTMLElement)) {
        const div = document.createElement('div');
        div.classList.add('pl-2');

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
        characterList.children[1].appendChild(div);

        input.addEventListener('change', (e) => {
          if (e.target.checked) {
            characters.add(character.key);
          } else {
            characters.delete(character.key);
          }

          updateFilterCounts(characters);
        });
      } else {
        test.querySelector('input').checked = false;
      }
    }

    const playerList = document.getElementById('playerNames');
    const dropPlayer = playerList.children[0];
    dropPlayer.classList.remove('-rotate-90');
    dropPlayer.addEventListener('click', hideMenuItems);
    for (const { key: player, value } of playerDim.group().top(Infinity)) {
      const id = `p${player}Filter`;
      const test = document.getElementById(id);
      if (!(test instanceof HTMLElement)) {
        const div = document.createElement('div');
        div.classList.add('pl-2');

        const input = document.createElement('input');
        input.id = id;
        input.classList.add('cursor-pointer');
        input.type = 'checkbox';
        input.checked = false;

        const label = document.createElement('label');
        label.classList.add('cursor-pointer', 'ml-1');
        label.setAttribute('for', input.id);
        label.innerHTML = `${player} (<span>${value}</span>)`;

        div.appendChild(input);
        div.appendChild(label);
        playerList.children[1].appendChild(div);

        input.addEventListener('change', (e) => {
          if (e.target.checked) {
            playerNames.add(player);
          } else {
            playerNames.delete(player);
          }

          updateFilterCounts(playerNames);
        });
      } else {
        test.querySelector('input').checked = false;
      }
    }

    updateFilterCounts();
  });

import(
  /* webpackPreload: true */
  /* webpackPrefetch: true */
  /* webpackChunkName: "players" */
  '../lib/players'
)
  .then(({ names }) => domMaps.character
    .forEach((node) => Object.entries(names)
      .sort()
      .forEach(([value, text]) => {
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
      .then(() => window.location.reload()));

    document.getElementById('delete').addEventListener('click', () => Promise.all(
      [...selectedMatches]
        .map((image) => post('/api/ultimate/profile/delete', { image })),
    ).then(() => window.location.reload()));
  });
