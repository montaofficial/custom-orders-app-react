import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import Admin from './components/Admin';
import Comande from "./components/Comande";
import Menu from "./components/Menu";
import NotFound from "./components/NotFound";

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/:idRistorante/cassa/">
            <Admin />
          </Route>
          <Route path="/:idRistorante/comande/">
            <Comande />
          </Route>
          <Route path="/:idRistorante/:idTavolo/">
            <Menu />
          </Route>
          <Route path="/">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
