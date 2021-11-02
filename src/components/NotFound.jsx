import React, { Component } from "react";

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <div className="fixed-top navbar-home">
          <div className="row justify-content-between">
            <div className="col-auto">
              <span className="img">
                <img src="/logo-sham-low.svg" alt="logo sham" />
              </span>
              <span className="title">
                SHAMROCK <span className="yellow"> GESTIONE</span>
              </span>
            </div>
          </div>
        </div>
        <div className="admin-container">
          <h1 className="white">Benvenuto, accedi alla tua pagina!</h1>
          <a
            className="table-container-waiter-waiting rounded row justify-content-center py-2 mt-5 me-3 ms-3"
            href="/614d9fb7db2d0588b88a006b/gestione"
          >
            <div className="col-auto">
              <h1>Amministratore</h1>
            </div>
          </a>
          <a
            className="table-container-waiter-waiting rounded row justify-content-center py-2 mt-5 me-3 ms-3"
            href="/614d9fb7db2d0588b88a006b/modifica"
          >
            <div className="col-auto">
              <h1>Modifica Menù</h1>
            </div>
          </a>
          <a
            className="table-container-waiter-waiting rounded row justify-content-center py-2 mt-5 me-3 ms-3"
            href="/614d9fb7db2d0588b88a006b/waiter"
          >
            <div className="col-auto">
              <h1>Gestione</h1>
            </div>
          </a>
          <a
            className="table-container-waiter-waiting rounded row justify-content-center py-2 mt-5 me-3 ms-3"
            href="/614d9fb7db2d0588b88a006b/cucina"
          >
            <div className="col-auto">
              <h1>Cucina</h1>
            </div>
          </a>
        </div>
      </>
    );
  }
}

export default NotFound;
