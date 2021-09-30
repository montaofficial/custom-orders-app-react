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
    };
  }

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
        console.log(body);
      } catch (e) {
        console.log(e.message);
      }

      if (!body) return console.log("Empty JSON!!!");

      if (body.shape == "custom-orders.v1.orders") {
        console.log("Updated!");

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

        //Detecting changes in order
        let tablesBefore = tables;
        let waitingConfirmationNow = [];
        for (let i = 0; i < tables.length; i++) {
          for (let c = 0; c < tables[i].orders.length; c++) {
            if (tables[i].orders[c].currentState === "Waiting confirmation") {
              waitingConfirmationNow.push(tables[i].orders[c]._id);
            }
          }
        }
        if (
          !_.isEqual(
            _.sortBy(this.state.waitingConfirmation),
            _.sortBy(waitingConfirmationNow)
          ) &&
          waitingConfirmationNow.length >= this.state.waitingConfirmation.length
        ) {
          console.log("Suono del nuovo");
          this.playAudio();
          this.setState({
            tables,
            waitingConfirmation: waitingConfirmationNow,
          });
        }

        this.setState({ tables });
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

  playAudio() {
    const audioEl = document.getElementsByClassName("audio-element")[0];
    audioEl.play();
  }

  render() {
    return (
      <>
        <audio className="audio-element">
          <source src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"></source>
        </audio>
        {this.state.page === "cassa" ? (
          <Admin
            onPageChange={this.handlePageChange}
            tables={this.state.tables}
          />
        ) : null}
        {this.state.page === "cucina" ? (
          <Comande
            onPageChange={this.handlePageChange}
            tables={this.state.tables}
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
