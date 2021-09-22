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
          <Route path="/:idRistorante/cassa/"  component={Admin}/>
          <Route path="/:idRistorante/comande/"  component={Comande}/>
          <Route path="/:idRistorante/:idTavolo/" component={Menu}/>
          <Route path="/">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
