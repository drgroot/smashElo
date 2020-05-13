/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Input,
  Label,
  Button,
  Alert,
} from 'reactstrap';
import { names } from '../../lib/players';
import { post } from '../../lib/request';

const properties = [
  { state: 'player', attribute: 'playerName' },
  { state: 'character', attribute: 'character' },
  { state: 'place', attribute: 'place' },
];

const save = (games, edits) => games.forEach((game) => {
  const image = { ...game };

  // setup defaults
  if (!image.players || image.players.length !== 2) {
    image.players = [[0, 1].map(() => ({ playerName: '', place: 1, character: '' }))];
  }
  if (!image.characters || image.characters.length !== 2) {
    image.characters = [[0, 1].map(() => ({ place: 1, character: '' }))];
  }

  for (const [key, values] of Object.entries(edits)) {
    const [{ attribute }] = properties.filter((p) => p.state === key);

    for (const [i, value] of values.entries()) {
      if (value && value !== '') {
        image.players[i][attribute] = value;
        image.characters[i][attribute] = value;
      }
    }
  }

  post('/game/ultimate/profile/saveGame', { image });
});

const deleteGames = (games) => games.forEach((game) => post('game/ultimate/profile/deleteGame', { game }));

const Editor = (props) => {
  const { selectedGames } = props;
  const [edits, setEdits] = useState({
    player: [null, null],
    character: [null, null],
    place: [null, null],
  });
  const { player, character, place } = edits;

  const setState = (index, value, attribute) => {
    const newState = { ...edits };
    newState[attribute] = [...edits[attribute]];
    newState[attribute][index] = value;
    setEdits(newState);
  };

  useEffect(
    () => {
      let changeState = false;
      const newState = {};
      for (const { state, attribute } of properties) {
        newState[state] = [...edits[state]];

        for (const i of [0, 1]) {
          const defState = [...new Set(
            selectedGames
              .filter((s) => s.players && s.players.length >= i + 1)
              .map((g) => g.players[i][attribute]),
          )];

          if (defState.length === 1) {
            [newState[state][i]] = defState;
            changeState = true;
          } else {
            newState[state][i] = null;
          }
        }
      }

      if (changeState) {
        setEdits(newState);
      }
    },
    // eslint-disable-next-line
    [selectedGames],
  );

  const errors = [...new Set(selectedGames.map((g) => g.error))];

  return (
    <Container style={{ padding: '4px' }}>
      {errors.length === 1 && errors[0] !== 'false' && (
        <Row>
          <Alert color="danger">{`Error: ${errors[0]}`}</Alert>
        </Row>
      )}
      <Row>
        {[0, 1].map((i) => (
          <Col
            key={i}
            md="6"
          >
            <Row>
              <Col md="3">
                <Label>{`P${i + 1}:`}</Label>
              </Col>
              <Col md="9">
                <Row>
                  <Input
                    type="text"
                    value={player[i] ? player[i] : ''}
                    onChange={(e) => setState(i, e.target.value, 'player')}
                  />
                </Row>
                <Row>
                  <Input
                    type="select"
                    value={character[i] ? character[i] : ''}
                    onChange={(e) => setState(i, e.target.value, 'character')}
                  >
                    {Object.entries(names).map(([code, name]) => (
                      <option
                        key={`${code}${i}`}
                        value={code}
                      >
                        {name}
                      </option>
                    ))}
                  </Input>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col md="3">
                <Label>Place: </Label>
              </Col>
              <Col md="9">
                <Input
                  type="select"
                  value={place[i] ? place[i] : ''}
                  onChange={(e) => setState(i, parseInt(e.target.value, 10), 'place')}
                >
                  {[1, 2].map((p) => (
                    <option
                      key={`${p}${i}`}
                      value={p}
                    >
                      {p}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
      <Row style={{ marginTop: '4px' }}>
        <Button
          color="primary"
          onClick={() => save(selectedGames, edits)}
        >
          Save
        </Button>
        <Button
          color="danger"
          style={{ marginLeft: '2px' }}
          onClick={() => deleteGames(selectedGames)}
        >
          Delete
        </Button>
      </Row>
    </Container>
  );
};

export default Editor;
