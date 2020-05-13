import React from 'react';
import PropTypes from 'prop-types';
import { CrossfilterContext } from './crossfilter';

const ChartTemplate = (props) => {
  const {
    chartFunction,
    styles,
  } = props;

  const div = React.useRef(null);
  const context = React.useContext(CrossfilterContext);

  // eslint-disable-next-line no-unused-vars
  const [chart, setChart] = React.useState(null);

  React.useEffect(() => {
    const newChart = chartFunction(div.current, context);
    if (newChart) {
      newChart.render();
      setChart(newChart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  return (
    <div
      ref={div}
      style={{
        ...styles,
      }}
    />
  );
};

ChartTemplate.propTypes = {
  /**
   * @description function will create a chart
   * @param {Element} elem reference element to create the chart in
   * @param {Object} context context object containing crossfilter and dimensions
   */
  chartFunction: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
};

ChartTemplate.defaultProps = {
  chartFunction: () => null,
  styles: {},
};

export default ChartTemplate;
