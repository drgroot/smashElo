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

  const refreshGames = () => get('/api/ultimate/profile/games')
    .then(({ data }) => {
      let diff = (data.length !== allGames.length);

      if (!diff) {
        const hashes = allGames
          .map(({
            hash, error, players, characters,
          }) => JSON.stringify({
            hash, error, players, characters,
          }));

        for (const {
          hash, error, players, characters,
        } of data) {
          if (!hashes.includes(JSON.stringify({
            hash, error, players, characters,
          }))) {
            diff = true;
            break;
          }
        }
      }

      if (diff) {
        if (selectedGames.length > 0) {
          setSelected([]);
        }

        setGames(data);
      }
    });

  refreshGames();


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
              <Editor selectedGames={selectedGames} refreshGames={() => refreshGames()} />
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
