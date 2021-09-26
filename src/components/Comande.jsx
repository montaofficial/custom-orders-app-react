import React, { Component } from "react";
import Order from "./common/Order";

class Comande extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
          <div className="row justify-content-between">
            <div className="col-auto">
              <inline className="img">
                <img src="/logo-sham.png" alt="logo sham" />
              </inline>
              <inline className="title">
                BURGER <inline className="yellow">ORDERS</inline>
              </inline>
            </div>
            <div
              className="col-auto"
              onClick={() => this.props.onPageChange("tavoli")}
            >
              <div className="allign-right-title">
                <div className="menu-icon">
                  <i className="fas fa-utensils" />
                </div>
                <div className="menu-subtitle">CUCINA</div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-container">
          <div>
            <h1 className="white">
              {this.handleTitleRendering(
                "Orders",
                this.handleFiltering(this.props.tables, "Confirmed").length
              )}
            </h1>
            <Order
              page="cucina"
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
              page="cucina"
              onAction={this.props.onAction}
              tables={this.handleFiltering(this.props.tables, "In preparation")}
            />
          </div>
          <div>
            <h1 className="white">
              {this.handleTitleRendering(
                "Ready",
                this.handleFiltering(this.props.tables, "Ready").length
              )}
            </h1>
            <Order
              page="cucina"
              onAction={this.props.onAction}
              tables={this.handleFiltering(this.props.tables, "Ready")}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Comande;
