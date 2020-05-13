import * as dc from 'dc';
import invertColor from '../lib/invertColor';
import { names, colors } from '../lib/players';

const charWinChart = (elem, context) => {
  const { character, winCharacterPercentage } = context;

  const top6 = () => ({
    all: () => winCharacterPercentage.order((p) => p.count).top(6),
  });

  const chart = new dc.RowChart(elem)
    .dimension(character)
    .group(top6())
    .keyAccessor((p) => p.key)
    .valueAccessor((p) => Math.round(p.value.percent * 100 * 100) / 100)
    .colorAccessor((p) => p.value.percent)
    .elasticX(true)
    .height(200)
    .width(600)
    .label((d) => `${names[d.key]} (${d.value.count} games)`)
    .gap(1)
    .useViewBoxResizing(true)
    .on('renderlet', (ch) => {
      // invert the text to most optimal black and white form
      const { _groups: rows } = ch.selectAll('g.row');
      if (rows.length > 0) {
        rows[0].forEach((row) => {
          const background = row.childNodes[0].getAttribute('fill');
          row.childNodes[1].setAttribute('fill', invertColor(background));
        });
      }
    });

  chart.addFilterHandler((filters, filter) => [filter]);
  chart.xAxis().tickFormat((v) => `${v}%`);

  chart.colorCalculator((datum) => {
    const { key } = datum;
    const filter = character.currentFilter();
    if (typeof filter !== 'undefined') {
      if (key !== filter) {
        return 'rgb(211,211,211)';
      }
    }

    return colors[key];
  });

  return chart;
};

export default charWinChart;
