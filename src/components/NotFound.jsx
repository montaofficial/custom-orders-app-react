import React, { Component } from "react";

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="not-found">
        <h1>Pagina non trovata!</h1>
        <p>Assicurati di scansionare correttamente il QR e non fare scherzi!</p>
        <li class="nav-item">
          <a
            class="nav-link"
            href="http://192.168.1.84:3000/614d9fb7db2d0588b88a006b/gestione"
          >
            Gestione
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="http://192.168.1.84:3000/614d9fb7db2d0588b88a006b/34"
          >
            Table
          </a>
        </li>
      </div>
    );
  }
}

export default NotFound;
