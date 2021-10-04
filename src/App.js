import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import NotFound from "./components/NotFound";
import Gestione from "./components/Gestione";
import Cucina from "./components/Cucina";
import GestioneWaiter from "./components/GestioneWaiter";

import logo from "./logo.svg";
import "./App.css";
import Table from "./components/Table";

function App() {
  return (
    <Router>
      <div className="container-flex noselect">
        <Switch>
          <Route path="/:idRistorante/gestione" component={Gestione} />
          <Route path="/:idRistorante/waiter" component={GestioneWaiter} />
          <Route path="/:idRistorante/cucina" component={Cucina} />
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
