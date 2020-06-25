import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import * as dc from 'dc';
import { Crossfilter } from '../lib/crossfilter';
import ChartTemplate from '../lib/chartTemplate';
import { get } from '../lib/request';
import { names } from '../lib/players';
import characterChart from './charWinChart';
import playerChart from './playWinChart';
import heatChart from './heatChart';

const compareFn = (props, state) => props.character !== state.character;

const addDataFn = (props, state, crossfilter, skip = 0) => get('/api/ultimate/game/get/character', { name: props.character, skip, id: props.character })
  .then((res) => {
    if (res.data.id !== props.character) return;

    // add data to crossfilter
    // eslint-disable-next-line no-labels
    matchLoop:
    for (const match of res.data.crossfilter) {
      // make sure match is valid
      for (let i = 0; i < match.players.length; i += 1) {
        if (
          typeof match.pSkill[i] !== 'number'
          || typeof match.cSkill[i] !== 'number'
          || typeof match.players[i] !== 'string'
          || typeof match.characters[i] !== 'string'
        ) {
          // eslint-disable-next-line no-labels, no-continue
          continue matchLoop;
        }
      }
      crossfilter.add([match]);
    }

    // re draw all the charts
    dc.redrawAll();

    // call again if not finished
    if (!res.data.finished) {
      addDataFn(props, state, crossfilter, res.data.crossfilter.length);
    }
  });

const getNewS = (props) => ({ character: props.character });

const createDimensions = (props, state, crossfilter, dimensions) => {
  if (dimensions.character) return dimensions;

  const getOpponentCharacter = (entry) => {
    const index = entry.characters.indexOf(props.character);
    return (entry.characters[(index === 0) ? 1 : 0]);
  };
  const getPlayer = (entry) => {
    const index = entry.characters.indexOf(props.character);
    return (entry.players[index]);
  };
  const getPSkillDiff = (entry) => {
    const index = entry.characters.indexOf(props.character);
    const oppSkill = entry.pSkill[(index === 0) ? 1 : 0];
    const diff = entry.pSkill[index] - oppSkill;
    return parseInt(diff, 10);
  };

  return {
    character: crossfilter.dimension((d) => getOpponentCharacter(d)),
    player: crossfilter.dimension((d) => getPlayer(d)),
    skillDiff: crossfilter.dimension((d) => getPSkillDiff(d)),
  };
};

const createGroups = (props, state, dimensions, groups) => {
  if (groups.winSkillPercentage) return groups;
  const { character, player, skillDiff } = dimensions;

  const getPlace = (entry) => entry.characters.indexOf(props.character) + 1;
  const init = () => ({ count: 0, wins: 0, percent: 0 });
  const add = (p, entry) => {
    const v = { ...p };
    v.count += 1;
    if (getPlace(entry) === 1) {
      v.wins += 1;
    }

    v.percent = (v.count > 0) ? v.wins / v.count : 0;
    return v;
  };
  const remove = (p, entry) => {
    const v = { ...p };
    v.count -= 1;
    if (getPlace(entry) === 1) {
      v.wins -= 1;
    }

    v.percent = (v.count > 0) ? v.wins / v.count : 0;
    return v;
  };

  return {
    winCharacterPercentage: character.group().reduce(add, remove, init),
    winPlayerPercentage: player.group().reduce(add, remove, init),
    winSkillPercentage: skillDiff.group().reduce(add, remove, init),
  };
};

function CharacterDashboard() {
  const { character } = useParams();
  const style = {
    backgroundImage: `url('/assets/full/${character}.png')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: -2,
    position: 'absolute',
    height: '100%',
    opacity: 0.25,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <Crossfilter
      character={character}
      compareFn={compareFn}
      addDataFn={addDataFn}
      getNewS={getNewS}
      createDimensions={createDimensions}
      createGroups={createGroups}
    >
      <Container
        style={style}
      />
      <Container>
        <Row>
          <img
            src={`${process.env.PUBLIC_URL}/assets/emblem/${character}.svg`}
            alt=""
            height="50px"
          />
          <h1>{names[character]}</h1>
        </Row>
        <Row>
          <Col xs="12" md="6">
            <div style={{ textAlign: 'center' }}>Frequent Opponents</div>
            <ChartTemplate chartFunction={characterChart} />
            <div style={{ textAlign: 'center' }}>Win %</div>
          </Col>
          <Col xs="12" md="6">
            <div style={{ textAlign: 'center' }}>Frequent Players</div>
            <ChartTemplate chartFunction={playerChart} />
            <div style={{ textAlign: 'center' }}>Win %</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div style={{ textAlign: 'center' }}>Heat Map</div>
            <ChartTemplate chartFunction={heatChart} />
          </Col>
        </Row>
      </Container>
    </Crossfilter>
  );
}

export default CharacterDashboard;
