import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import NotFound from "./components/NotFound";
import Gestione from "./components/Gestione";
import Cucina from "./components/Cucina";
import GestioneWaiter from "./components/GestioneWaiter";
import Login from "./components/Login";

import logo from "./logo.svg";
import "./App.css";
import Table from "./components/Table";


const AuthRoute = props => {
  const { type } = props;
  const isAuthUser = localStorage.getItem('custom-orders-token');
  if (type === "login" && isAuthUser) return <Redirect to="/" />;
  else if (type === "private" && !isAuthUser) return <Redirect to="/login" />;

  return <Route {...props} />;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return (
      <Router>
        <div className="container-flex noselect">
          <Switch>
          <AuthRoute path="/login" type="login"><Login callBack={()=>{this.updateToken()}}/></AuthRoute>
          <AuthRoute path="/:idRistorante/gestione" type="private" component={Gestione}/>
            <Route path="/:idRistorante/gestione" component={Gestione}/>
            <AuthRoute path="/:idRistorante/waiter" type="private" component={GestioneWaiter} />
            <AuthRoute path="/:idRistorante/cucina" type="private" component={Cucina} />
            <Route path="/:idRistorante/:idTavolo/" component={Table} />
            <Route path="/">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }

  logout() {
    localStorage.removeItem('custom-orders-token');
    this.setState({ user: null});
  }
  
  updateToken() {
    let user;
      const token = localStorage.getItem('custom-orders-token');
      if (token) user = jwt_decode(token);
  
      this.setState({user: user});
  }
}
 
export default App;
