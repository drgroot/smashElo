/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Label,
  Input,
  Col,
  Container,
  Row,
  Collapse,
  ListGroup,
  ListGroupItem,
  InputGroup,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationCircle,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import './filters.css';
import { names } from '../../lib/players';

const isGameError = (game) => {
  if (game === 'type') return 'error';

  if (game.players.length > 0) {
    // eslint-disable-next-line no-restricted-globals
    return !isFinite(game.players[0].skill);
  }

  if (game.error === 'false') return false;
  return game.error;
};

const filterCharacter = (game, char) => {
  if (game === 'type') return char;

  if (game.characters) {
    for (const { character } of game.characters) {
      if (character === char) {
        return true;
      }
    }
  }

  return false;
};

const Filters = (props) => {
  const {
    games,
    filteredGames,
    activeFilters,
    setFilterFunctions,
  } = props;
  const [openChar, setOpenChar] = useState(true);
  const filters = activeFilters.map((f) => f('type'));

  const filterCheck = (filter, func) => {
    const newFilters = [...activeFilters];
    if (filters.includes(filter)) {
      newFilters.splice(filters.indexOf(filter), 1);
    } else {
      newFilters.push(func);
    }

    setFilterFunctions(newFilters);
  };

  const uniqCharacters = new Set(
    games
      .map(
        ({ characters } = { characters: [] }) => characters
          .map(({ character }) => character),
      )
      .flat(),
  );

  const characterGameCount = (character) => filteredGames
    .filter((g) => filterCharacter(g, character))
    .length;

  return (
    <Container>
      <Row className="checkList error">
        <Col>
          <InputGroup>
            <Label check>
              <Input
                type="checkbox"
                checked={filters.includes('error')}
                onChange={() => filterCheck('error', isGameError)}
              />
              <FontAwesomeIcon icon={faExclamationCircle} color="red" />
              {` Error (${games.filter(isGameError).length})`}
            </Label>
          </InputGroup>
        </Col>
      </Row>

      <Row className="checkList">
        <Col>
          <h5
            style={{ cursor: 'pointer' }}
            onClick={() => setOpenChar(!openChar)}
          >
            <FontAwesomeIcon
              icon={faCaretDown}
              transform={(openChar) ? {} : { rotate: -90 }}
            />
            {' Characters'}
          </h5>
          <Collapse isOpen={openChar}>
            <ListGroup>
              {[...uniqCharacters].map((character) => (
                <ListGroupItem
                  key={character}
                >
                  <Label check style={{ cursor: 'pointer' }}>
                    <Input
                      type="checkbox"
                      checked={filters.includes(character)}
                      onChange={() => filterCheck(
                        character,
                        (game) => filterCharacter(game, character),
                      )}
                    />
                    <img
                      src={`/assets/head/${character}.png`}
                      alt={character}
                      width="25px"
                    />
                    {` ${names[character]} (${characterGameCount(character)})`}
                  </Label>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Collapse>
        </Col>
      </Row>

    </Container>
  );
};

Filters.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  games: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  activeFilters: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  filteredGames: PropTypes.array.isRequired,
  setFilterFunctions: PropTypes.func.isRequired,
};

export default Filters;
