import './base.css';
import './character.css';
import './template/template';

const charts = [];
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

const initSkill = () => ({ count: 0, totalSkill: 0, average: 0 });
const addSkill = (key) => (p, entry) => {
  const index = entry.characters.indexOf(character);
  const v = { ...p };
  v.totalSkill += entry[key][index];
  v.count += 1;
  v.average = (v.count === 0) ? 0 : v.totalSkill / v.count;
  return v;
};
const rmSkill = (key) => (p, entry) => {
  const index = entry.characters.indexOf(character);
  const v = { ...p };
  v.totalSkill -= entry[key][index];
  v.count -= 1;
  v.average = (v.count === 0) ? 0 : v.totalSkill / v.count;
  return v;
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

const playerChart = (dc, d3, group, dim, invertColor) => {
  const top6 = () => ({
    all: () => group.order((p) => p.count).top(6),
  });

  const elem = document.getElementById('playerchart');
  const chart = new dc.RowChart(elem)
    .dimension(dim)
    .group(top6())
    .valueAccessor((p) => Math.round(p.value.percent * 100 * 100) / 100)
    .colorAccessor((p) => p.value.percent)
    .keyAccessor((p) => p.key)
    .elasticX(true)
    .label((d) => `${d.key} (${d.value.count} games)`)
    .gap(1)
    .width(elem.offsetWidth)
    .height(elem.offsetHeight)
    .useViewBoxResizing(true)
    .on('renderlet', (ch) => {
      // invert the text to most optimal black and white form
      const { _groups: rows } = ch.selectAll('g.row');
      if (rows.length > 0) {
        rows[0].forEach((row) => {
          const width = row.childNodes[0].getAttribute('width');
          const background = row.childNodes[0].getAttribute('fill');
          row.childNodes[1].setAttribute('fill', (width > 40) ? invertColor(background) : '#000');
          // eslint-disable-next-line no-param-reassign
          row.childNodes[2].innerHTML += '%';
        });
      }
    });

  chart.addFilterHandler((filters, filter) => [filter]);
  chart.xAxis().tickFormat((v) => `${v}%`);

  chart.colorCalculator((datum) => {
    const { key, value } = datum;
    const filter = dim.currentFilter();
    if (typeof filter !== 'undefined') {
      if (key !== filter) {
        return 'rgb(211,211,211)';
      }
    }

    return d3.interpolateRdYlGn(value.percent);
  });

  chart.render();
  return chart;
};

const opponentChart = (dc, group, dim, invertColor, names, colors) => {
  const top6 = () => ({
    all: () => group.order((p) => p.count).top(6),
  });

  const elem = document.getElementById('opponentchart');
  const chart = new dc.RowChart(elem)
    .dimension(dim)
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
          row.childNodes[2].innerHTML = `${row.childNodes[2].innerHTML
            .replace(opponent, names[opponent])}%`;
        });
      }
    });

  chart.addFilterHandler((filters, filter) => [filter]);
  chart.xAxis().tickFormat((v) => `${v}%`);

  chart.colorCalculator((datum) => {
    const { key } = datum;
    const filter = dim.currentFilter();
    if (typeof filter !== 'undefined') {
      if (key !== filter) {
        return 'rgb(211,211,211)';
      }
    }

    return colors[key];
  });

  chart.render();
  return chart;
};

const heatChart = (dc, d3, group, dim) => {
  const elem = document.getElementById('heatmap');
  const chart = new dc.ScatterPlot(elem)
    .dimension(dim)
    .group(group)
    .valueAccessor((p) => Math.round(p.value.percent * 100 * 100) / 100)
    .keyAccessor((p) => p.key)
    .colorAccessor((p) => p.value.percent)
    .elasticX(true)
    .width(elem.offsetWidth)
    .height(elem.offsetHeight)
    .x(d3.scaleLinear().domain([-200, 200]))
    .y(d3.scaleLinear().domain([0, 100]))
    .xAxisLabel('Player Skill Difference')
    .yAxisLabel('Win %')
    .brushOn(false)
    .height(200)
    .width(600)
    .useViewBoxResizing(true);

  chart.render();
  return chart;
};

const skillChart = (dc, d3, dateDim, playerSkill, characterSkill, invertColor, colors) => {
  const elem = document.getElementById('skilltime');
  const chart = new dc.CompositeChart(elem);

  const values = playerSkill.top(Infinity);
  const [{ value: { average: max } } = { value: { average: 1350 } }] = values;
  const { value: { average: min } } = values[values.length - 1] || { value: { average: 1100 } };
  const color = colors[character];
  const offset = 2;

  chart
    .dimension(dateDim)
    .elasticX(true)
    .width(elem.offsetWidth)
    .height(elem.offsetHeight)
    .x(d3.scaleTime())
    .brushOn(true)
    .width(elem.offsetWidth)
    .height(elem.offsetHeight)
    .yAxisLabel('')
    .useViewBoxResizing(true)
    .y(d3.scaleLinear().domain([min * (1 - offset / 100), max * (1 + offset / 100)]))
    .legend(dc.legend().x(10).y(255))
    .compose([
      dc.lineChart(chart)
        .group(playerSkill, 'Player Skill')
        .valueAccessor((p) => p.value.average)
        .colors(invertColor(color, false)),
      dc.lineChart(chart)
        .colors(color)
        .valueAccessor((p) => p.value.average)
        .group(characterSkill, 'Character Skill'),
    ]);

  chart.render();
  return chart;
};

if (character) {
  import(
    /* webpackPreload: true */
    /* webpackPrefetch: true */
    /* webpackChunkName: "crossfilter2" */
    'crossfilter2'
  )
    .then(({ default: Crossfilter }) => {
      const crossfilter = Crossfilter([]);

      // define dimensions
      const playerDim = crossfilter.dimension((d) => getPlayer(d));
      const characterDim = crossfilter.dimension((d) => getOppCharacter(d));
      const skillDiffDim = crossfilter.dimension((d) => getPSkillDiff(d));
      const dateDim = crossfilter.dimension((d) => (new Date(d.date)).getTime());

      // define groups
      const winCharacter = characterDim.group().reduce(add, remove, init);
      const winPlayer = playerDim.group().reduce(add, remove, init);
      const winSkill = skillDiffDim.group().reduce(add, remove, init);
      const playerSkill = dateDim.group().reduce(addSkill('pSkill'), rmSkill('pSkill'), initSkill);
      const characterSkill = dateDim.group().reduce(addSkill('cSkill'), rmSkill('cSkill'), initSkill);

      return Promise.all([
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

            for (const chart of charts) {
              chart.render();
            }

            return getMatches(character);
          }),
        Promise.all([
          import(
            /* webpackPreload: true */
            /* webpackPrefetch: true */
            /* webpackChunkName: "dc" */
            'dc'
          ),
          import(
            /* webpackPreload: true */
            /* webpackPrefetch: true */
            /* webpackChunkName: "d3" */
            'd3'
          ),
          import(
            /* webpackPreload: true */
            /* webpackPrefetch: true */
            /* webpackChunkName: "invertColor" */
            './lib/invertColor'
          ),
          import(
            /* webpackPreload: true */
            /* webpackPrefetch: true */
            /* webpackChunkName: "players" */
            './lib/players'
          ),
        ])
          .then(([dc, d3, { default: invertColor }, { names, colors }]) => charts.push(
            playerChart(dc, d3, winPlayer, playerDim, invertColor),
            opponentChart(dc, winCharacter, characterDim, invertColor, names, colors),
            heatChart(dc, d3, winSkill, skillDiffDim),
            skillChart(dc, d3, dateDim, playerSkill, characterSkill, invertColor, colors),
          )),
      ]);
    });

  import(
    /* webpackPreload: true */
    /* webpackPrefetch: true */
    /* webpackChunkName: "players" */
    './lib/players'
  )
    .then(({ names }) => {
      const Name = names[character];
      document.title = `${Name} Stats`;
      document.getElementById('pagetitle').innerText = document.title;
    });
}
