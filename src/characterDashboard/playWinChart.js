import * as dc from 'dc';
import * as d3 from 'd3';
import invertColor from '../lib/invertColor';

const playWinChart = (elem, context) => {
  const { player, winPlayerPercentage } = context;
  const top6 = () => ({
    all: () => winPlayerPercentage.order((p) => p.count).top(6),
  });

  const chart = new dc.RowChart(elem)
    .dimension(player)
    .group(top6())
    .valueAccessor((p) => Math.round(p.value.percent * 100 * 100) / 100)
    .colorAccessor((p) => p.value.percent)
    .keyAccessor((p) => p.key)
    .elasticX(true)
    .height(200)
    .width(600)
    .label((d) => `${d.key} (${d.value.count} games)`)
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
    const { key, value } = datum;
    const filter = player.currentFilter();
    if (typeof filter !== 'undefined') {
      if (key !== filter) {
        return 'rgb(211,211,211)';
      }
    }

    return d3.interpolateRdYlGn(value.percent);
  });

  return chart;
};

export default playWinChart;
