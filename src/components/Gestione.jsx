import React, { Component } from "react";
import _ from "lodash";
import Comande from "./Comande";
import Admin from "./Admin";
import MrQR from "./MrQR";
import TableOverview from "./TableOverview";
import axios from "axios";

class Gestione extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "cassa",
      tables: [],
      waitingConfirmation: [],
      confirmed: [],
    };
  }

 tempConfirmed = [];
 tempWaitingConfirmation = [];
 isFirstTime = true;

  checkIfMounted() {
    return this.mounted;
  }

  componentDidMount() {
    this.mounted = true;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(
      "wss://custom-orders.smontanari.com/api/orders/" +
        this.props?.match?.params?.idRistorante
    );
    this.ws.onopen = () => {
      console.log("wss connected!");
    };

    this.ws.onmessage = (e) => {
      let body = {};
      try {
        body = JSON.parse(e.data);
        //console.log(body);
      } catch (e) {
        console.log(e.message);
      }

      if (!body) return console.log("Empty JSON!!!");

      if (body.shape == "custom-orders.v1.orders") {
        //console.log("Updated!");

        let tableObject = {};
        let tables = [];

        for (let order of body.orders) {
          if (!tableObject[order.table])
            tableObject[order.table] = {
              number: order.tableName,
              id: order.table,
              orders: [],
            };

          tableObject[order.table].orders.push(order);
        }

        for (let tableId in tableObject) {
          tables.push(tableObject[tableId]);
        }

        //Detecting changes in orders
        let waitingConfirmationNow = [];
        let confirmedNow = [];
        for (let order of body.orders) {
            if (order.currentState === "Waiting confirmation") {
              waitingConfirmationNow.push(order._id);
            }
            if (order.currentState === "Confirmed") {
              confirmedNow.push(order._id);
            }
        }
        // passo gli array cambiati qui dentro
        this.playAudio({confirmedNow, waitingConfirmationNow})

        this.setState({
          tables,
          waitingConfirmation: waitingConfirmationNow,
          confirmed: confirmedNow,
        });
      }
    };

    this.ws.onclose = (e) => {
      console.log(
        "Socket is closed. Reconnect will be attempted in 1 second.",
        e.reason
      );
      if (!this.checkIfMounted()) return this.componentWillUnmount();
      setTimeout(() => {
        this.connect();
      }, 1000);
    };

    this.ws.onerror = (err) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
    };
  }

  componentWillUnmount() {
    this.mounted = false;
    this.ws.onclose = (e) => {
      console.log("Socket is safely closed.", e.reason);
    };
    this.ws.close();

    if (this.interval) clearInterval(this.interval);
  }

  handlePageChange = (p) => {
    let page = p;
    this.setState({ page });
  };

  playAudio(data) {
    if (this.isFirstTime) {
      this.isFirstTime = false;
      this.tempWaitingConfirmation = data.waitingConfirmationNow;
      this.tempConfirmed = data.confirmedNow;
      return;
    }
   if (this.state.page == "cassa") {
    const newOrders = this.tempWaitingConfirmation;
    const oldOrders = data.waitingConfirmationNow;
    if (
      !_.isEqual(_.sortBy(oldOrders), _.sortBy(newOrders)) &&
      oldOrders.length >= newOrders.length
    ) {
      console.log("Nuova comanda in cassa, suono!");
      try {
        const audioEl = document.getElementById("audio-element");
        audioEl.play();
        this.tempWaitingConfirmation = oldOrders;
      } catch (e) {
        console.log(e.message)
      }
    }
   }

   if (this.state.page == "cucina") {
    const newOrders = this.tempConfirmed;
    const oldOrders = data.confirmedNow;
    if (
      !_.isEqual(_.sortBy(oldOrders), _.sortBy(newOrders)) &&
      oldOrders.length >= newOrders.length
    ) {
      console.log("Nuova comanda in cucina, suono!");
      try {
        const audioEl = document.getElementById("audio-element");
        audioEl.play();
        this.tempConfirmed = oldOrders;
      } catch (e) {
        console.log(e.message)
      }
    }
   }
  }

  render() {
    return (
      <>
        {this.state.page === "cassa" ? (
          <Admin
            onPageChange={this.handlePageChange}
            tables={this.state.tables}
            waitingConfirmation={this.state.waitingConfirmation}
          />
        ) : null}
        {this.state.page === "cucina" ? (
          <Comande
            onPageChange={this.handlePageChange}
            tables={this.state.tables}
            confirmed={this.state.confirmed}
          />
        ) : null}
        {this.state.page === "tavoli" ? (
          <TableOverview
            idRistorante={this.props?.match?.params?.idRistorante}
            onPageChange={this.handlePageChange}
            tables={this.state.tables}
          />
        ) : null}
        {this.state.page === "qr" ? (
          <MrQR
            onPageChange={this.handlePageChange}
            idRistorante={this.props?.match?.params?.idRistorante}
          />
        ) : null}
      </>
    );
  }
}

export default Gestione;
