const { post } = require('../lib/request');

// handles opening and closing of the navigation menu
const navopen = document.getElementById('navopenbutton');
const navcontainer = document.getElementById('navcontainer');
if (navopen.offsetParent !== null) {
  navopen.addEventListener('click', () => {
    navcontainer.classList.remove('hidden');
    navopen.classList.add('hidden');
    document.getElementById('navclosebutton').classList.remove('hidden');
  });

  document.getElementById('navclosebutton').addEventListener('click', () => {
    navcontainer.classList.add('hidden');
    navopen.classList.remove('hidden');
    document.getElementById('navclosebutton').classList.add('hidden');
  });
} else {
  navcontainer.classList.remove('hidden');
}

// set title of page to page title
document.getElementById('pagetitle').innerText = document.title;

// move content node and set height
const pageContent = document.getElementById('page-content');
const content = document.getElementById('content');
if (content instanceof HTMLElement) {
  pageContent.appendChild(content);
}

// set the active page class
const pages = navcontainer.querySelectorAll('a');
for (const page of pages) {
  const href = page.href.replace(window.location.origin, '');
  if (window.location.href.indexOf(href) > -1 && href !== '/') {
    // loop through classes and get hover state
    for (const className of Array.from(page.classList)) {
      if (className.startsWith('hover:')) {
        page.classList.add(className.replace('hover:', ''));
      }
    }
  }
}

document.getElementById('loginbutton').addEventListener('click', () => {
  for (const node of pages) {
    const href = node.href.replace(window.location.origin, '');
    if (node.classList.contains('oauthlogin') || href === '/') {
      node.classList.remove('hidden');
    } else {
      node.classList.add('hidden');
    }
  }
});

document.getElementById('enablenamespacing').addEventListener('click', () => post('/api/session/setNamespace')
  .then(() => window.location.reload()));

import(
  /* webpackPreload: true */
  /* webpackPrefetch: true */
  /* webpackChunkName: "request" */
  '../lib/request'
).then(({ get }) => get('/api/session')
  .then(({ namespace = false }) => {
    document.getElementById('enablenamespacing').checked = namespace;
    Array.from(navcontainer.querySelectorAll('.login'))
      .forEach((node) => node.classList.remove('hidden'));
    Array.from(navcontainer.querySelectorAll('.nologin'))
      .forEach((node) => node.classList.add('hidden'));
  })
  .catch(() => {
    Array.from(navcontainer.querySelectorAll('.login'))
      .forEach((node) => node.classList.add('hidden'));
    Array.from(navcontainer.querySelectorAll('.nologin'))
      .forEach((node) => node.classList.remove('hidden'));
  }));
