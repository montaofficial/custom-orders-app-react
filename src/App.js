import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Menu from "./components/Menu";
import NotFound from "./components/NotFound";
import Gestione from "./components/Gestione";

import logo from "./logo.svg";
import "./App.css";
import Table from "./components/Table";

function App() {
  return (
    <Router>
      <div className="container noselect">
        <Switch>
          <Route path="/:idRistorante/gestione" component={Gestione} />
          <Route path="/:idRistorante/:idTavolo/" component={Table} />
          <Route path="/">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
