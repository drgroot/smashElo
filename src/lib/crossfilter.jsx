import React, { useState } from 'react';
import PropTypes from 'prop-types';
import crossfilter from 'crossfilter2';

export const CrossfilterContext = React.createContext();

export const Crossfilter = (props) => {
  const {
    compareFn,
    addDataFn,
    getNewS,
    createDimensions,
    createGroups,
    children,
  } = props;

  const [state, setS] = useState({
    ndx: crossfilter([]),
    dimensions: {},
    groups: {},
    propState: {},
  });

  if (compareFn(props, state.propState)) {
    // reset undo all filters and then remove crossfilter entries
    for (const filter of Object.values(state.dimensions)) {
      filter.filterAll();
    }
    state.ndx.remove();

    // trigger to get new data
    addDataFn(props, state.propState, state.ndx);

    // call create dimensions and groups and call a set state
    const dimensions = createDimensions(props, state.propState, state.ndx, state.dimensions);
    const groups = createGroups(props, state.propState, dimensions, state.groups);
    setS({
      ndx: state.ndx,
      propState: getNewS(props, state.propState),
      dimensions,
      groups,
    });
  }

  return (
    <CrossfilterContext.Provider
      value={{
        crossfilter: state.ndx,
        state: state.propState,
        ...state.dimensions,
        ...state.groups,
      }}
    >
      {children}
    </CrossfilterContext.Provider>
  );
};

Crossfilter.propTypes = {
  /**
   * @description function compares the state to props and returns boolean if should update or not.
   * @param {Object} props
   * @param {Object} state
   * @returns {boolean} return true if should run getDataFn
   */
  compareFn: PropTypes.func.isRequired,

  /**
   * @description Promise function that will add entries into the crossfilter
   * @param {Object} props
   * @param {Object} state
   * @param {Crossfilter} crossfilter
   */
  addDataFn: PropTypes.func.isRequired,

  /**
   * @decription sets any state variables outside of the crossfilter.
   * @param {Object} props
   * @param {Object} state
   * @returns {Object} new state
   */
  getNewS: PropTypes.func.isRequired,

  /**
   * @description returns object containing dimensions
   * @param {Object} props
   * @param {Object} state
   * @param {Crossfilter} crossfilter
   * @param {Object<string,Dimension>} dimensions
   * @returns {Object<string,Dimension>} dimensions
   */
  createDimensions: PropTypes.func,

  /**
   * @description returns object containing groupings on dimensions
   * @param {Object} props
   * @param {Object} state
   * @param {Object<string,Dimension>} dimensions
   * @param {Object<string,Group>} groups
   * @returns {Object<string,Group>} groups
   */
  createGroups: PropTypes.func,

  /**
   * @ignore
   */
  children: PropTypes.element.isRequired,
};

Crossfilter.defaultProps = {
  createDimensions: () => { },
  createGroups: () => { },
};
