import React, { Component } from 'react';

class NotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="not-found">
                <h1>Pagina non trovata!</h1>
                <p>Assicurati di scansionare correttamente il QR e non fare scherzi!</p>
            </div>
         );
    }
}
 
export default NotFound;