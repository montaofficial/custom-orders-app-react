import React, { Component } from "react";
import Order from "./common/Order";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  handleTitleRendering = (title, numberOfItems) => {
    if (numberOfItems > 0) return title;
  };

  render() {
    return (
      <div>
        <div className="fixed-top navbar-home">
          <div className="row">
            <div className="col-auto">
              <inline className="img">
                <img src="/logo-sham.png" alt="logo sham" />
              </inline>
              <inline className="title">
                CUSTOM <inline className="yellow"> BURGER ORDERS</inline>
              </inline>
            </div>
            <div className="col">
              <div
                className="allign-right-title"
                onClick={() => this.props.onPageChange("cucina")}
              >
                <i className="fas fa-cash-register m-2" />
                CASSA
              </div>
            </div>
          </div>
        </div>

        <div className="admin-container">
          <div>
            <h1 className="white">
              {this.handleTitleRendering(
                "Waiting confirmation",
                this.handleFiltering(this.props.tables, "Waiting confirmation")
                  .length
              )}
            </h1>
            <Order
              page="cassa"
              onAction={this.props.onAction}
              tables={this.handleFiltering(
                this.props.tables,
                "Waiting confirmation"
              )}
            />
          </div>
          <div>
            <h1 className="white">
              {this.handleTitleRendering(
                "Confirmed",
                this.handleFiltering(this.props.tables, "Confirmed").length
              )}
            </h1>
            <Order
              page="cassa"
              onAction={this.props.onAction}
              tables={this.handleFiltering(this.props.tables, "Confirmed")}
            />
          </div>
          <div>
            <h1 className="white">
              {this.handleTitleRendering(
                "In preparation",
                this.handleFiltering(this.props.tables, "In preparation").length
              )}
            </h1>
            <Order
              page="cassa"
              onAction={this.props.onAction}
              tables={this.handleFiltering(this.props.tables, "In preparation")}
            />
          </div>
          <div>
            <h1 className="white">
              {this.handleTitleRendering(
                "Deleted",
                this.handleFiltering(this.props.tables, "Deleted").length
              )}
            </h1>
            <Order
              page="cassa"
              onAction={this.props.onAction}
              tables={this.handleFiltering(this.props.tables, "Deleted")}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
