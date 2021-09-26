import React, { Component } from "react";
import Order from "./common/Order";
import axios from "axios";
const baseUrl = "https://custom-orders.smontanari.com/api/";

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

  handleButtons = async (order, action) => {
    let state = ""; // "Waiting confirmation", "Confirmed", "In preparation", "Ready", "Deleted"
    if (action == "btn1") {
      if (order.currentState == "Deleted") state = "Confirmed";
      if (order.currentState == "Waiting confirmation") state = "Confirmed";
      if (order.currentState == "Confirmed") state = "In preparation";
      if (order.currentState == "In preparation") state = "Ready";
      if (order.currentState == "Ready") state = "Done";
    }

    if (action == "btn2") {
      if (order.currentState == "Waiting confirmation") state = "Deleted";
      if (order.currentState == "Confirmed") state = "Deleted";
    }
    try {
      const response = await axios.post(baseUrl + `orders/${order._id}`, {
        currentState: state,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
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
              onClick={() => this.props.onPageChange("cucina")}
            >
              <div className="allign-right-title">
                <div className="menu-icon">
                  <i className="fas fa-cash-register" />
                </div>
                <div className="menu-subtitle">CASSA</div>
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
              onAction={this.handleButtons}
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
              onAction={this.handleButtons}
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
              onAction={this.handleButtons}
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
              page="cassa"
              onAction={this.handleButtons}
              tables={this.handleFiltering(this.props.tables, "Ready")}
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
              onAction={this.handleButtons}
              tables={this.handleFiltering(this.props.tables, "Deleted")}
            />
          </div>
          <div>
            <div className="row">
              <div className="col-auto">
                <h1 className="white">Done</h1>
              </div>
              <div className="col-auto">
                <i className="fas fa-sort-up sort-icon-up cursor-pointer"></i>
              </div>
            </div>

            <Order
              page="cassa"
              onAction={this.handleButtons}
              tables={this.handleFiltering(this.props.tables, "Done")}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
