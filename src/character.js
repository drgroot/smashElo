import Crossfilter from 'crossfilter2';
import * as d3 from 'd3';
import * as dc from 'dc';
import './base.css';
import './template/template';
import invertColor from './lib/invertColor';
import { names, colors } from './lib/players';

const character = window.location.search.replace('?', '');

const getPlayer = (entry) => {
  const index = entry.characters.indexOf(character);
  return entry.players[index];
};

const getOppCharacter = (entry) => {
  const index = entry.characters.indexOf(character);
  const characters = [...entry.characters];
  characters.splice(index, 1);
  return characters[0];
};

const getPSkillDiff = (entry) => {
  const index = entry.characters.indexOf(character);
  const skill = [...entry.pSkill];

  const [pSkill] = skill.splice(index, 1);
  const [oppSkill] = [skill];
  return pSkill - oppSkill;
};

const getPlace = (entry) => entry.characters.indexOf(character) + 1;
const init = () => ({ count: 0, wins: 0, percent: 0 });
const add = (p, entry) => {
  const v = { ...p };
  v.count += 1;

  if (getPlace(entry) === 1) {
    v.wins += 1;
  }

  v.percent = (v.count > 0) ? (v.wins / v.count) : 0;
  return v;
};
const remove = (p, entry) => {
  const v = { ...p };
  v.count -= 1;
  if (getPlace(entry) === 1) {
    v.wins -= 1;
  }

  v.percent = (v.count > 0) ? v.wins / v.count : 0;
  return v;
};

const crossfilter = Crossfilter([]);

// define dimensions
const playerDim = crossfilter.dimension((d) => getPlayer(d));
const characterDim = crossfilter.dimension((d) => getOppCharacter(d));
const skillDiffDim = crossfilter.dimension((d) => getPSkillDiff(d));

// define groups
const winCharacter = characterDim.group().reduce(add, remove, init);
const winPlayer = playerDim.group().reduce(add, remove, init);
const winSkill = skillDiffDim.group().reduce(add, remove, init);

const heatChart = (elem) => {
  const chart = new dc.ScatterPlot(elem)
    .dimension(skillDiffDim)
    .group(winSkill)
    .valueAccessor((p) => Math.round(p.value.percent * 100 * 100) / 100)
    .keyAccessor((p) => p.key)
    .colorAccessor((p) => p.value.percent)
    .elasticX(true)
    .x(d3.scaleLinear().domain([-200, 200]))
    .y(d3.scaleLinear().domain([0, 100]))
    .xAxisLabel('Player Skill Difference')
    .yAxisLabel('Win %')
    .brushOn(false)
    .height(200)
    .width(600)
    .useViewBoxResizing(true);

  return chart;
};

const opponentChart = (elem) => {
  const top6 = () => ({
    all: () => winCharacter.order((p) => p.count).top(6),
  });

  const chart = new dc.RowChart(elem)
    .dimension(characterDim)
    .group(top6())
    .keyAccessor((p) => p.key)
    .valueAccessor((p) => Math.round(p.value.percent * 100 * 100) / 100)
    .colorAccessor((p) => p.value.percent)
    .elasticX(true)
    .width(elem.offsetWidth)
    .height(elem.offsetHeight)
    .label((d) => `${names[d.key]} (${d.value.count} games)`)
    .gap(1)
    .useViewBoxResizing(true)
    .on('renderlet', (ch) => {
      // invert the text to most optimal black and white form
      const { _groups: rows } = ch.selectAll('g.row');
      if (rows.length > 0) {
        rows[0].forEach((row) => {
          const width = row.childNodes[0].getAttribute('width');
          const background = row.childNodes[0].getAttribute('fill');
          row.childNodes[1].setAttribute('fill', (width > 40) ? invertColor(background) : '#000');

          const [opponent] = row.childNodes[2].innerHTML.split(':');
          // eslint-disable-next-line no-param-reassign
          row.childNodes[2].innerHTML = row.childNodes[2].innerHTML
            .replace(opponent, names[opponent]);
        });
      }
    });

  chart.addFilterHandler((filters, filter) => [filter]);
  chart.xAxis().tickFormat((v) => `${v}%`);

  chart.colorCalculator((datum) => {
    const { key } = datum;
    const filter = characterDim.currentFilter();
    if (typeof filter !== 'undefined') {
      if (key !== filter) {
        return 'rgb(211,211,211)';
      }
    }

    return colors[key];
  });

  return chart;
};

const playerChart = (elem) => {
  const top6 = () => ({
    all: () => winPlayer.order((p) => p.count).top(6),
  });

  const chart = new dc.RowChart(elem)
    .dimension(playerDim)
    .group(top6())
    .valueAccessor((p) => Math.round(p.value.percent * 100 * 100) / 100)
    .colorAccessor((p) => p.value.percent)
    .keyAccessor((p) => p.key)
    .elasticX(true)
    .label((d) => `${d.key} (${d.value.count} games)`)
    .gap(1)
    .useViewBoxResizing(true)
    .on('renderlet', (ch) => {
      // invert the text to most optimal black and white form
      const { _groups: rows } = ch.selectAll('g.row');
      if (rows.length > 0) {
        rows[0].forEach((row) => {
          const width = row.childNodes[0].getAttribute('width');
          const background = row.childNodes[0].getAttribute('fill');
          row.childNodes[1].setAttribute('fill', (width > 40) ? invertColor(background) : '#000');
        });
      }
    });

  chart.addFilterHandler((filters, filter) => [filter]);
  chart.xAxis().tickFormat((v) => `${v}%`);

  chart.colorCalculator((datum) => {
    const { key, value } = datum;
    const filter = playerDim.currentFilter();
    if (typeof filter !== 'undefined') {
      if (key !== filter) {
        return 'rgb(211,211,211)';
      }
    }

    return d3.interpolateRdYlGn(value.percent);
  });
  return chart;
};

if (character) {
  import(
    /* webpackPreload: true */
    /* webpackPrefetch: true */
    /* webpackChunkName: "request" */
    './lib/request'
  )
    .then(({ get }) => {
      const getMatches = (name, skip = 0) => get('/api/ultimate/game/get/character', { name, skip })
        .then(({ crossfilter: matches, finished }) => {
          crossfilter.add(matches);
          if (!finished) {
            return getMatches(name, matches.length + skip);
          }

          return crossfilter;
        });

      return getMatches(character);
    })
    .then(() => {
      opponentChart(document.getElementById('opponentchart')).render();
      playerChart(document.getElementById('playerchart')).render();
      heatChart(document.getElementById('heatmap')).render();
    });

  const Name = names[character];
  document.title = `${Name} Stats`;
  document.getElementById('pagetitle').innerText = document.title;
}
