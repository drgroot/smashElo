!function(e){function t(t){for(var n,i,c=t[0],l=t[1],d=t[3]||[],u=0,f=[];u<c.length;u++)i=c[u],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&f.push(r[i][0]),r[i]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(s&&s(t),d.forEach((function(e){if(void 0===r[e]){r[e]=null;var t=document.createElement("link");o.nc&&t.setAttribute("nonce",o.nc),t.rel="prefetch",t.as="script",t.href=a(e),document.head.appendChild(t)}}));f.length;)f.shift()()}var n={},r={5:0};function a(e){return o.p+""+({4:"players",7:"vendors~crossfilter2"}[e]||e)+"."+{4:"ee0fc984a72377754c91",7:"e1cfece527d1325d01b5"}[e]+".js"}function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var i=new Promise((function(t,a){n=r[e]=[t,a]}));t.push(n[2]=i);var c,l=document.createElement("script");l.charset="utf-8",l.timeout=120,o.nc&&l.setAttribute("nonce",o.nc),l.src=a(e);var s=new Error;c=function(t){l.onerror=l.onload=null,clearTimeout(d);var n=r[e];if(0!==n){if(n){var a=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;s.message="Loading chunk "+e+" failed.\n("+a+": "+o+")",s.name="ChunkLoadError",s.type=a,s.request=o,n[1](s)}r[e]=void 0}};var d=setTimeout((function(){c({type:"timeout",target:l})}),12e4);l.onerror=l.onload=c,document.head.appendChild(l)}return Promise.all(t)},o.m=e,o.c=n,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/",o.oe=function(e){throw console.error(e),e};var i=window.webpackJsonp=window.webpackJsonp||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var s=c,d=o(o.s=142);t([[],{},0,[4,7]])}({1:function(e,t,n){"use strict";n.r(t),n.d(t,"get",(function(){return a})),n.d(t,"post",(function(){return o}));var r=function(e){return e.json()},a=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=new URL(window.location.origin+e);return t&&(n.search=new URLSearchParams(t).toString()),fetch(n,{method:"GET",mode:"same-origin",credentials:"same-origin",headers:{"Content-Type":"application/json"},redirect:"follow"}).then(r)},o=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return fetch(e,{method:"POST",mode:"same-origin",credentials:"same-origin",headers:{"Content-Type":"application/json"},redirect:"follow",body:JSON.stringify(t)}).then(r)}},142:function(e,t,n){"use strict";n.r(t);n(2),n(3);function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e){return function(e){if(Array.isArray(e))return s(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||l(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=l(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,a=function(){};return{s:a,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){n=e[Symbol.iterator]()},n:function(){var e=n.next();return i=e.done,e},e:function(e){c=!0,o=e},f:function(){try{i||null==n.return||n.return()}finally{if(c)throw o}}}}function c(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,a=!1,o=void 0;try{for(var i,c=e[Symbol.iterator]();!(r=(i=c.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(e){a=!0,o=e}finally{try{r||null==c.return||c.return()}finally{if(a)throw o}}return n}(e,t)||l(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(e,t){if(e){if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var d=[],u=new Set,f=document.getElementById("page-content");document.getElementById("content").style.height="".concat(f.offsetHeight-f.children[0].offsetHeight,"px");var m={playerName:[1,2].map((function(e){return document.getElementById("p".concat(e,"name"))})),character:[1,2].map((function(e){return document.getElementById("p".concat(e,"char"))})),place:[1,2].map((function(e){return document.getElementById("p".concat(e,"place"))}))},h=function(){var e=document.getElementById("editor");if(0===u.size)return e.classList.add("hidden");for(var t=function(){var e,t=c(r[n],2),a=t[0],l=i(t[1].entries());try{var s=function(){var t=c(e.value,2),n=t[0],r=t[1],i=new Set(o(u).filter((function(e){return e.players.length>=n+1})).map((function(e){return e.players[n][a]})));if(1===i.size){var l=c(i,1);r.value=l[0]}else r.value=""};for(l.s();!(e=l.n()).done;)s()}catch(e){l.e(e)}finally{l.f()}},n=0,r=Object.entries(m);n<r.length;n++)t();var a=document.getElementById("matchError"),l=new Set(o(u).map((function(e){return e.error})));return l.has("false")||l.has(!1)?a.classList.add("hidden"):(a.innerText="Error: ".concat(l.values().next().value),a.classList.remove("hidden")),e.classList.remove("hidden")},p=[],v=null,y=function(e,t,n){for(var r=Math.ceil(e.length/t),a=document.getElementById("paginator"),o=new Set,l=0;l<5;l+=1)n-l>0&&o.add(n-l),n+l<r&&o.add(n+l);var s=Array.from(a.children);if(v!==e){v=e;for(var d=s.length>r?s.length:r,u=function(t){if(s[t]instanceof HTMLElement&&(s[t].removeEventListener("click",p[t]),p[t]=null,t>r&&a.removeChild(s[t])),t<r){if(t>=s.length||!(s[t]instanceof HTMLElement)){var i=document.createElement("div");i.innerText=t+1,i.classList.add("ml-1","cursor-pointer"),a.appendChild(i),s[t]=i}p[t]=function(){return g(e,t)},s[t].addEventListener("click",p[t]),t===n?(s[t].classList.remove("text-blue-500"),s[t].classList.add("text-red-500")):(s[t].classList.remove("text-red-500"),s[t].classList.add("text-blue-500","hover:text-red-400")),o.has(t)?s[t].classList.remove("hidden"):s[t].classList.add("hidden")}},f=0;f<d;f+=1)u(f)}else{var m,h=i(s.entries());try{for(h.s();!(m=h.n()).done;){var y=c(m.value,2),b=y[0],E=y[1];o.has(b)?E.classList.remove("hidden"):E.classList.add("hidden"),E.classList.contains("text-red-500")&&b!==n?(E.classList.remove("text-red-500"),E.classList.add("text-blue-500")):b===n&&(E.classList.remove("text-blue-500"),E.classList.add("text-red-500"))}}catch(e){h.e(e)}finally{h.f()}}},g=function(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=document.getElementById("gallery"),a=parseFloat(getComputedStyle(document.documentElement).fontSize),c=(r.offsetWidth-15)/3>200?(r.offsetWidth-15)/3:200,l=Math.floor(r.offsetWidth/c),s=Math.floor(.8*document.getElementById("content").offsetHeight/(.5*c)),f=l*s,m=e.slice(n*f,(n+1)*f),p=new Set([].concat(o(m),d)),v=i(p);try{var g=function(){var e=t.value;if(m.includes(e)){if(!d.includes(e)){d.push(e);var n=document.createElement("div");n.id=e.hash,n.style.width="".concat(c,"px"),n.classList.add("p-2"),n.innerHTML+='<img src="'.concat(e.image,'" loading="lazy" class=\'cursor-pointer\' width="').concat(c-1*a,'px">'),r.appendChild(n),n.querySelector("img").addEventListener("click",(function(t){var r,a,o=["border-blue-500","border-4"];u.has(e)?(u.delete(e),(r=t.target.classList).remove.apply(r,o),"false"!==e.error&&!1!==e.error&&n.children[0].classList.add("border-red-500","border-4")):(u.add(e),t.target.classList.remove("border-red-500"),(a=t.target.classList).add.apply(a,o));h()})),"false"!==e.error&&!1!==e.error&&n.children[0].classList.add("border-red-500","border-4")}}else d.splice(d.indexOf(e),1),u.delete(e),document.getElementById(e.hash).remove()};for(v.s();!(t=v.n()).done;)g()}catch(e){v.e(e)}finally{v.f()}h(),y(e,f,n)},b=function(e){var t=e.target.children[0].classList.contains("-rotate-90");t?e.target.children[0].classList.remove("-rotate-90"):e.target.children[0].classList.add("-rotate-90");var n,r,a=i(e.target.parentNode.children);try{for(a.s();!(n=a.n()).done;){var o=n.value;o!==e.target&&(r=o,t?r.classList.remove("hidden"):r.classList.add("hidden"))}}catch(e){a.e(e)}finally{a.f()}};Promise.all([n.e(7).then(n.bind(null,138)),Promise.resolve().then(n.bind(null,1)).then((function(e){return(0,e.get)("/api/ultimate/profile/games")})),n.e(4).then(n.bind(null,4))]).then((function(e){var t=c(e,3),n=t[0].default,r=t[1],a=t[2].names,l=n(r),s=l.dimension((function(e){return"false"!==e.error&&!1!==e.error})),d=l.dimension((function(e){return e.hash})),u=l.dimension((function(e){return e.characters.map((function(e){return e.character}))}),!0),f=l.dimension((function(e){return e.players.map((function(e){return e.playerName}))}),!0),m=l.dimension((function(e){return e.characters.map((function(e){return e.character}))}),!0),h=l.dimension((function(e){return e.players.map((function(e){return e.playerName}))}),!0),p=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=e;n.nextElementSibling.querySelector("span").innerText=t},v=new Set,y=new Set,E=document.getElementById("errorFilter"),L=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;e===v&&(v.size>0?u.filter((function(e){return v.has(e)})):u.filterAll()),e===y&&(y.size>0?f.filter((function(e){return y.has(e)})):f.filterAll()),p.apply(void 0,[E].concat(o(s.group().top(1/0).filter((function(e){return!0===e.key})).map((function(e){return e.value})))));var t,n=i(m.group().top(1/0));try{for(n.s();!(t=n.n()).done;){var r=t.value,a=r.key,c=r.value,l=document.getElementById("".concat(a,"Filter"));c>0?(l.parentElement.classList.remove("hidden"),p(l,c)):0!==c||l.parentElement.classList.contains("hidden")||l.parentElement.classList.add("hidden")}}catch(e){n.e(e)}finally{n.f()}var b,L=i(h.group().top(1/0));try{for(L.s();!(b=L.n()).done;){var w=b.value,S=w.key,I=w.value,O=document.getElementById("p".concat(S,"Filter"));I>0?(O.parentElement.classList.remove("hidden"),p(O,I)):0!==I||O.parentElement.classList.contains("hidden")||O.parentElement.classList.add("hidden")}}catch(e){L.e(e)}finally{L.f()}g(d.top(1/0))};E.parentElement.parentElement.style.height="".concat(.95*document.getElementById("content").offsetHeight,"px"),E.addEventListener("change",(function(e){s.filter(!!e.target.checked||null),L()})),E.checked=!1;var w=document.getElementById("characterNames"),S=w.children[0];S.classList.remove("-rotate-90"),S.addEventListener("click",b);var I,O=i(u.group().top(1/0));try{var j=function(){var e=I.value,t=document.getElementById("".concat(e.key,"Filter"));if(t instanceof HTMLElement)t.querySelector("input").checked=!1;else{var n=document.createElement("div");n.classList.add("pl-2");var r=document.createElement("input");r.id="".concat(e.key,"Filter"),r.classList.add("cursor-pointer"),r.type="checkbox",r.checked=!1;var o=document.createElement("label");o.classList.add("cursor-pointer","ml-1"),o.setAttribute("for",r.id),o.innerHTML="".concat(a[e.key]," (<span>").concat(e.value,"</span>)"),n.appendChild(r),n.appendChild(o),w.children[1].appendChild(n),r.addEventListener("change",(function(t){t.target.checked?v.add(e.key):v.delete(e.key),L(v)}))}};for(O.s();!(I=O.n()).done;)j()}catch(e){O.e(e)}finally{O.f()}var k=document.getElementById("playerNames"),A=k.children[0];A.classList.remove("-rotate-90"),A.addEventListener("click",b);var x,B=i(f.group().top(1/0));try{var P=function(){var e=x.value,t=e.key,n=e.value,r="p".concat(t,"Filter"),a=document.getElementById(r);if(a instanceof HTMLElement)a.querySelector("input").checked=!1;else{var o=document.createElement("div");o.classList.add("pl-2");var i=document.createElement("input");i.id=r,i.classList.add("cursor-pointer"),i.type="checkbox",i.checked=!1;var c=document.createElement("label");c.classList.add("cursor-pointer","ml-1"),c.setAttribute("for",i.id),c.innerHTML="".concat(t," (<span>").concat(n,"</span>)"),o.appendChild(i),o.appendChild(c),k.children[1].appendChild(o),i.addEventListener("change",(function(e){e.target.checked?y.add(t):y.delete(t),L(y)}))}};for(B.s();!(x=B.n()).done;)P()}catch(e){B.e(e)}finally{B.f()}L()})),n.e(4).then(n.bind(null,4)).then((function(e){var t=e.names;return m.character.forEach((function(e){return Object.entries(t).sort().forEach((function(t){var n=c(t,2),r=n[0],a=n[1],o=document.createElement("option");o.value=r,o.innerText=a,e.appendChild(o)}))}))})),Promise.resolve().then(n.bind(null,1)).then((function(e){var t=e.post;document.getElementById("save").addEventListener("click",(function(){return Promise.all(o(u).map((function(e){var n=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e);if((!n.players||n.players.length>2)&&(n.players=[]),(!n.characters||n.characters.length>2)&&(n.characters=[]),n.players.length<2)for(var o=0;o<2-n.players.length;o+=1)n.players.push({playerName:"",place:1,character:""});if(n.characters.length<2)for(var l=0;l<2-n.characters.length;l+=1)n.characters.push({place:1,character:""});for(var s=0,d=Object.entries(m);s<d.length;s++){var u,f=c(d[s],2),h=f[0],p=i(f[1].entries());try{for(p.s();!(u=p.n()).done;){var v=c(u.value,2),y=v[0],g=v[1];g.value&&""!==g.value&&g.value.length>0&&(n.players[y][h]="place"===h?parseInt(g.value,10):g.value,n.characters[y][h]="place"===h?parseInt(g.value,10):g.value)}}catch(e){p.e(e)}finally{p.f()}}return t("/api/ultimate/profile/saveGame",{image:n})}))).then((function(){return window.location.reload()}))})),document.getElementById("delete").addEventListener("click",(function(){return Promise.all(o(u).map((function(e){return t("/api/ultimate/profile/delete",{image:e})}))).then((function(){return window.location.reload()}))}))}))},2:function(e,t,n){},3:function(e,t,n){function r(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return a(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,o=function(){};return{s:o,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,c=!0,l=!1;return{s:function(){n=e[Symbol.iterator]()},n:function(){var e=n.next();return c=e.done,e},e:function(e){l=!0,i=e},f:function(){try{c||null==n.return||n.return()}finally{if(l)throw i}}}}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var o=n(1).post,i=document.getElementById("navopenbutton"),c=document.getElementById("navcontainer");null!==i.offsetParent?(i.addEventListener("click",(function(){c.classList.remove("hidden"),i.classList.add("hidden"),document.getElementById("navclosebutton").classList.remove("hidden")})),document.getElementById("navclosebutton").addEventListener("click",(function(){c.classList.add("hidden"),i.classList.remove("hidden"),document.getElementById("navclosebutton").classList.add("hidden")}))):c.classList.remove("hidden"),document.getElementById("pagetitle").innerText=document.title;var l=document.getElementById("page-content"),s=document.getElementById("content");s instanceof HTMLElement&&l.appendChild(s);var d,u=c.querySelectorAll("a"),f=r(u);try{for(f.s();!(d=f.n()).done;){var m=d.value,h=m.href.replace(window.location.origin,"");if(window.location.href.indexOf(h)>-1&&"/"!==h)for(var p=0,v=Array.from(m.classList);p<v.length;p++){var y=v[p];y.startsWith("hover:")&&m.classList.add(y.replace("hover:",""))}}}catch(e){f.e(e)}finally{f.f()}document.getElementById("loginbutton").addEventListener("click",(function(){var e,t=r(u);try{for(t.s();!(e=t.n()).done;){var n=e.value,a=n.href.replace(window.location.origin,"");n.classList.contains("oauthlogin")||"/"===a?n.classList.remove("hidden"):n.classList.add("hidden")}}catch(e){t.e(e)}finally{t.f()}})),document.getElementById("enablenamespacing").addEventListener("click",(function(){return o("/api/session/setNamespace").then((function(){return window.location.reload()}))})),Promise.resolve().then(n.bind(null,1)).then((function(e){return(0,e.get)("/api/session").then((function(e){var t=e.namespace,n=void 0!==t&&t;document.getElementById("enablenamespacing").checked=n,Array.from(c.querySelectorAll(".login")).forEach((function(e){return e.classList.remove("hidden")})),Array.from(c.querySelectorAll(".nologin")).forEach((function(e){return e.classList.add("hidden")}))})).catch((function(){Array.from(c.querySelectorAll(".login")).forEach((function(e){return e.classList.add("hidden")})),Array.from(c.querySelectorAll(".nologin")).forEach((function(e){return e.classList.remove("hidden")}))}))}))}});