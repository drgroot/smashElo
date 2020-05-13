import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import { colors } from '../lib/players';
import invertColor from '../lib/invertColor';
import { get } from '../lib/request';

function Dashboard() {
  const [characters, setCharacters] = useState([]);

  get('/game/ultimate/characters', {})
    .then(({ data }) => {
      if (data.length === characters.length) {
        let diff = false;
        for (const c of data) {
          if (!characters.includes(c)) {
            diff = true;
            break;
          }
        }

        if (diff) {
          setCharacters(data);
        }
      } else {
        setCharacters(data);
      }
    });

  return (
    <Container>
      <Row>
        {characters.map((character) => (
          <Col
            key={character}
          >
            <Link
              to={`/character/${character}`}
              style={{
                textDecoration: 'none',
                color: invertColor(colors[character]),
              }}
            >
              <img
                alt=""
                width="200px"
                style={{ marginBottom: '2vw' }}
                src={`${process.env.PUBLIC_URL}/assets/thumb_h/${character}.png`}
              />
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Dashboard;
