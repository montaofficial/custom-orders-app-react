import React, { Component } from "react";
import Comande from "./Comande";
import Admin from "./Admin";
import MrQR from "./MrQR";
import axios from "axios";

class Gestione extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "cassa",
      tables: [],
    };
  }

  checkIfMounted() {
    return this.mounted
 }

componentDidMount() {
    this.mounted=true;
    this.connect()
}

connect() {
  this.ws = new WebSocket('wss://custom-orders.smontanari.com/api/orders/' + this.props?.match?.params?.idRistorante);
  this.ws.onopen = ()=> {
    console.log("wss connected!");
  };

  this.ws.onmessage = (e)=> {
      let body = {};
      try {
          body = JSON.parse(e.data);
          console.log(body)
      } catch (e) { console.log(e.message)}

      if (!body) return console.log("Empty JSON!!!")

      if (body.shape == "custom-orders.v1.orders") {
          console.log('Updated!');

          let tableObject = {};
          let tables = [];

          for (let order of body.orders) {
            if (!tableObject[order.table]) tableObject[order.table] = {
              number: order.tableName,
              id: order.table,
              orders: []
            };

            tableObject[order.table].orders.push(order);
          }

          for (let tableId in tableObject) {
            tables.push(tableObject[tableId]);
          }
          
          this.setState({tables});
      }
      
  };

  this.ws.onclose = (e)=> {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      if (!this.checkIfMounted()) return this.componentWillUnmount();
      setTimeout(()=> {
        this.connect();
      }, 1000);
    };

  this.ws.onerror = (err)=> {
    console.error('Socket encountered error: ', err.message, 'Closing socket');
  };
}

componentWillUnmount() {
  this.mounted=false;
  this.ws.onclose = (e)=> {
      console.log('Socket is safely closed.', e.reason);
    };
   this.ws.close();

   if (this.interval) clearInterval(this.interval);
}

  handleAction = (order, table, action, page) => {
    //Removing current table from all tables
    let tables = this.state.tables.filter((t) => t.number !== table.number);
    //Extracting current table from all tables
    let newTable = this.state.tables.filter((t) => t.number === table.number);
    //Removing current order from current table
    let newOrders = newTable[0].orders.filter((o) => o._id !== order._id);

    let newOrder = order;
    //Handleing commands from CASSA
    if (
      newOrder.currentState === "Waiting confirmation" &&
      action === "confirm" &&
      page === "cassa"
    ) {
      newOrder.currentState = "Confirmed";
      console.log("confirmed");
    }
    if (
      newOrder.currentState === "Waiting confirmation" &&
      action === "delete" &&
      page === "cassa"
    ) {
      newOrder.currentState = "Deleted";
    }

    if (
      newOrder.currentState === "Confirmed" &&
      action === "delete" &&
      page === "cassa"
    ) {
      newOrder.currentState = "Deleted";
    }

    if (
      newOrder.currentState === "Deleted" &&
      action === "confirm" &&
      page === "cassa"
    ) {
      newOrder.currentState = "Waiting confirmation";
    }

    //Handleing commands from CASSA
    if (
      newOrder.currentState === "Confirmed" &&
      action === "confirm" &&
      page === "cucina"
    ) {
      console.log("in preparation");
      newOrder.currentState = "In preparation";
    }
    if (
      newOrder.currentState === "preparation" &&
      action === "confirm" &&
      page === "cucina"
    ) {
      newOrder.currentState = "Ready";
    }

    newOrders.push(newOrder);
    newTable[0].orders = newOrders;
    tables.push(newTable[0]);
    this.setState({ tables });
  };

  handlePageChange = (p) => {
    let page = p;
    this.setState({ page });
  };
  render() {
    if (this.state.page === "cassa")
      return (
        <Admin
          onPageChange={this.handlePageChange}
          onAction={this.handleAction}
          tables={this.state.tables}
        />
      );
    if (this.state.page === "cucina")
      return (
        <Comande
          onPageChange={this.handlePageChange}
          onAction={this.handleAction}
          tables={this.state.tables}
        />
      );
    if (this.state.page === "qr")
      return (
        <MrQR
          onPageChange={this.handlePageChange}
          idRistorante={this.props?.match?.params?.idRistorante}
        />
      );
  }
}

export default Gestione;
