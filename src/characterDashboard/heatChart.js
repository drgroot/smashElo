import * as dc from 'dc';
import * as d3 from 'd3';

const heatChart = (elem, context) => {
  const { skillDiff, winSkillPercentage } = context;

  const chart = new dc.ScatterPlot(elem)
    .dimension(skillDiff)
    .group(winSkillPercentage)
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

export default heatChart;
