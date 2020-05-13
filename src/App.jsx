import React, { useState } from 'react';
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
} from 'reactstrap';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

// different pages
import Dashboard from './dashboard/dashboard';
import Login from './login/login';
import Account from './login/account';
import Games from './profile/games/index';
import Upload from './profile/upload';
import CharacterView from './characterDashboard/index';

// import logo from './logo.svg';
import './App.css';

function NoMatch() {
  const location = useLocation();

  return (
    <div>
      <h3>
        {location.pathname}
      </h3>
    </div>
  );
}

const App = () => {
  const [cookie, setCookie] = useState(false);

  // get cookie
  if (!document.cookie) {
    const params = new URLSearchParams(window.location.search);
    const urlCookie = params.get('valid');

    if (urlCookie && cookie !== urlCookie) {
      document.cookie = urlCookie;
      setCookie(urlCookie);
    }
  } else if (cookie !== document.cookie) {
    setCookie(document.cookie);
  }

  return (
    <Router basename="/">
      <div>
        <Navbar color="light" light>
          <NavbarBrand href="/">SmashElo</NavbarBrand>
          {(cookie) && (
            <Nav className="mr-auto">
              <NavItem>
                <NavLink>
                  <Link to="/games">Games</Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link to="/upload">Upload</Link>
                </NavLink>
              </NavItem>
            </Nav>
          )}
          {(!cookie) && (
            <NavLink>
              <Link to="/login">Login</Link>
            </NavLink>
          )}
          {(cookie) && (
            <NavLink>
              <Link to="/account">Account</Link>
            </NavLink>
          )}
        </Navbar>
      </div>
      <Switch>
        <Route path="/" exact>
          <Dashboard />
        </Route>
        <Route path="/character/:character">
          <CharacterView />
        </Route>
        <Route path="/games">
          <Games />
        </Route>
        <Route path="/upload">
          <Upload />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
