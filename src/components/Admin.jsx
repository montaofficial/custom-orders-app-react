import React, { Component } from "react";
import Order from "./common/order";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
              currentState: "Waiting confirmation",
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

  handleIngredients = (order) => {
    const elements = order.ingredients.join(", ");
    return elements;
  };

  handleFiltering = (tables, filter) => {
    let filtered = [];
    let orders = [];
    let table = {
      number: 0,
      orders: [],
    };
    for (let i = 0; i < tables.length; i++) {
      table = {
        number: 0,
        orders: [],
      };
      orders = tables[i].orders;
      orders = orders.filter((order) => order.currentState === filter);
      table.number = tables[i].number;
      table.orders = orders;
      filtered.push(table);
    }
    //removing empty table
    filtered = filtered.filter((table) => table.orders.length > 0);
    return filtered;
  };

  handleAction = (order, table, action) => {
    //Removing current table from all tables
    let tables = this.state.tables.filter((t) => t.number !== table.number);
    //Extracting current table from all tables
    let newTable = this.state.tables.filter((t) => t.number === table.number);
    //Removing current order from current table
    let newOrders = newTable[0].orders.filter((o) => o._id !== order._id);

    let newOrder = order;
    if (
      newOrder.currentState === "Waiting confirmation" &&
      action === "confirm"
    ) {
      newOrder.currentState = "Confirmed";
    }
    if (
      newOrder.currentState === "Waiting confirmation" &&
      action === "delete"
    ) {
      newOrder.currentState = "Deleted";
    }
    if (newOrder.currentState === "Confirmed" && action === "delete") {
      newOrder.currentState = "Deleted";
    }
    if (newOrder.currentState === "Deleted" && action === "confirm") {
      newOrder.currentState = "Waiting confirmation";
    }

    newOrders.push(newOrder);
    newTable[0].orders = newOrders;
    tables.push(newTable[0]);
    this.setState({ tables });
  };

  handleReject = (id) => {
    console.log(id);
  };

  handleTitleRendering = (title, numberOfItems) => {
    if (numberOfItems > 0) return title;
  };

  render() {
    return (
      <div>
        <div className="fixed-top navbar-home">
          <inline className="img">
            <img src="/logo-sham.png" alt="logo sham" />
          </inline>
          <inline className="title">
            CUSTOM <inline className="yellow"> BURGER ORDERS</inline>
          </inline>
        </div>

        <div className="admin-container">
          <div>
            <h1 className="white">
              {this.handleTitleRendering(
                "Waiting confirmation",
                this.handleFiltering(this.state.tables, "Waiting confirmation")
                  .length
              )}
            </h1>
            <Order
              onAction={this.handleAction}
              tables={this.handleFiltering(
                this.state.tables,
                "Waiting confirmation"
              )}
            />
          </div>
          <div>
            <h1 className="white">
              {this.handleTitleRendering(
                "Confirmed",
                this.handleFiltering(this.state.tables, "Confirmed").length
              )}
            </h1>
            <Order
              onAction={this.handleAction}
              tables={this.handleFiltering(this.state.tables, "Confirmed")}
            />
          </div>
          <div>
            <h1 className="white">
              {this.handleTitleRendering(
                "Deleted",
                this.handleFiltering(this.state.tables, "Deleted").length
              )}
            </h1>
            <Order
              onAction={this.handleAction}
              tables={this.handleFiltering(this.state.tables, "Deleted")}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
