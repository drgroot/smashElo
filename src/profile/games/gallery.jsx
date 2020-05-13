/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle as fasCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

const notifyBadge = {
  position: 'absolute',
  left: '2px',
  top: '20px',
  cursor: 'pointer',
};

const alert = (status, selected = false) => {
  if (selected) {
    return <FontAwesomeIcon color="blue" icon={fasCircle} />;
  }

  if (typeof status === 'string' && status !== 'false') {
    return <FontAwesomeIcon color="red" icon={faExclamationCircle} />;
  }

  return <FontAwesomeIcon color="blue" icon={faCircle} />;
};

const Gallery = (props) => {
  const { games, selectedGames, setSelected } = props;

  const click = (match) => {
    const index = selectedGames.indexOf(match);
    const selection = [...selectedGames];
    if (index > -1) {
      selection.splice(index, 1);
    } else {
      selection.push(match);
    }

    setSelected(selection);
  };

  return (
    <Row>
      {games.map((match) => (
        <Col
          key={match.hash}
        >
          <div>
            <span
              style={notifyBadge}
              onClick={() => click(match)}
            >
              {alert(match.error, selectedGames.includes(match))}
            </span>
            <img
              src={match.image}
              className="image"
              alt=""
              style={{ width: '50vh', marginTop: '2em', cursor: 'pointer' }}
              onClick={() => click(match)}
            />
          </div>
        </Col>
      ))}
    </Row>
  );
};

Gallery.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  games: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selectedGames: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default Gallery;
