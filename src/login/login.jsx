import React from 'react';
import {
  Container, Row, Col, Button,
} from 'reactstrap';
import { API_URL } from '../lib/request';

const login = () => (
  <Container>
    <Row>
      <Col
        style={{ textAlign: 'center' }}
        md={{ size: 6, offset: 3 }}
      >
        <h2>Welcome Back</h2>
        <div style={{ marginTop: '2em' }}>
          <Button
            style={{
              backgroundColor: '#f1f2fa',
            }}
            onClick={() => { window.location.href = `${API_URL}/login/auth/twitch`; }}
          >
            <img height="25px" alt="" src={`${process.env.PUBLIC_URL}/img/oauth/twitch.png`} />
            <span style={{ color: '#60657b' }}>Connect with Twitch</span>
          </Button>
        </div>
      </Col>
    </Row>
  </Container>
);

export default login;
