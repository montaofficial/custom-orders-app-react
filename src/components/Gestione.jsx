import React, { Component } from "react";
import Comande from "./Comande";
import Admin from "./Admin";
import MrQR from "./MrQR";

class Gestione extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "cassa",
      tables: [
        {
          number: 30,
          orders: [
            {
              _id: "11111111",
              currentState: "Waiting confirmation",
              inPreparation: false,
              type: "Burger",
              ingredients: ["carne", "foglie", "spazzatura", "sangue", "canca"],
            },
            {
              _id: "22222222",
              currentState: "Waiting confirmation",
              inPreparation: true,
              type: "Burger",
              ingredients: ["cane", "pane", "sale", "rame", "fame"],
            },
            {
              _id: "33333333",
              currentState: "In preparation",
              inPreparation: false,
              type: "Appetizer",
              ingredients: ["Nuggets"],
            },
          ],
        },
        {
          number: 13,
          orders: [
            {
              _id: "44444444",
              currentState: "Waiting confirmation",
              inPreparation: false,
              type: "Burger",
              ingredients: [
                "salamandra",
                "catrame",
                "salsa",
                "droga",
                "sigarette",
              ],
            },
            {
              _id: "55555555",
              currentState: "Waiting confirmation",
              inPreparation: false,
              type: "Burger",
              ingredients: ["scusa", "mamma", "non", "torno", "stanotte"],
            },
            {
              _id: "66666666",
              currentState: "Waiting confirmation",
              inPreparation: false,
              type: "Appetizer",
              ingredients: ["Onion rings"],
            },
          ],
        },
        {
          number: 10,
          orders: [
            {
              _id: "77777777",
              currentState: "Deleted",
              inPreparation: false,
              type: "Burger",
              ingredients: ["mangio", "da", "solo", "cazzo", "piango"],
            },
          ],
        },
      ],
    };
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
      return <MrQR onPageChange={this.handlePageChange} />;
  }
}

export default Gestione;
