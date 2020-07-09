import './base.css';
import './template/template';

const content = document.getElementById('images');

// add in character images
import(
  /* webpackPreload: true */
  /* webpackPrefetch: true */
  /* webpackChunkName: "request" */
  './lib/request'
)
  .then(({ get }) => get('/api/ultimate/game/characters')
    .then((data) => data.forEach(
      (character) => import(`./img/assets/thumb_v/${character}.png`)
        .then(({ default: src }) => {
          const container = document.createElement('a');
          container.href = `/character.html?${character}`;

          const image = document.createElement('img');
          image.classList.add('w-10', 'lg:w-16', 'lg:rounded-md');
          image.setAttribute('src', src);
          image.loading = 'lazy';

          container.appendChild(image);
          content.appendChild(container);
        }))))
  .then(() => {
    document.getElementById('pagetitle').innerText = 'Choose A Fighter';
  });
