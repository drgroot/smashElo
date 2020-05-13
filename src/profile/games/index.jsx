import React, { useState } from 'react';
import {
  Row,
  Col,
  Container,
} from 'reactstrap';
import './games.css';
import { get } from '../../lib/request';
import Filters from './filters';
import Gallery from './gallery';
import Editor from './editor';

const Games = () => {
  const [allGames, setGames] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedGames, setSelected] = useState([]);

  if (allGames.length === 0) {
    get('/game/ultimate/profile/games')
      .then((res) => {
        if (res.data) {
          setGames(res.data);
        }
      });
  }

  // apply filters
  const games = (filters.length === 0) ? allGames : [];
  if (filters.length > 0) {
    // eslint-disable-next-line no-labels
    Game:
    for (const game of allGames) {
      for (const filter of filters) {
        if (!filter(game)) {
          // eslint-disable-next-line no-labels, no-continue
          continue Game;
        }
      }
      games.push(game);
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col md="3">
          <Filters
            games={allGames}
            filteredGames={games}
            activeFilters={filters}
            setFilterFunctions={setFilters}
          />
        </Col>
        <Col md="9">
          {selectedGames.length > 0 && (
            <Row>
              <Editor selectedGames={selectedGames} />
            </Row>
          )}
          <Gallery
            games={games}
            selectedGames={selectedGames}
            setSelected={setSelected}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Games;
