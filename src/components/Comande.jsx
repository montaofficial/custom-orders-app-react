import React, { Component } from "react";
import Order from "./common/Order";
import axios from "axios";
import _ from "lodash";
const baseUrl = "https://custom-orders.smontanari.com/api/";

class Comande extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmed: [],
    };
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

  handleButtons = async (order, action) => {
    let state = ""; // "Waiting confirmation", "Confirmed", "In preparation", "Ready", "Deleted"
    if (action == "btn1") {
      if (order.currentState == "Deleted") state = "Confirmed";
      if (order.currentState == "Waiting confirmation") state = "Confirmed";
      if (order.currentState == "Confirmed") state = "In preparation";
      if (order.currentState == "In preparation") state = "Ready";
    }

    if (action == "btn2") {
      if (order.currentState == "Waiting confirmation") state = "Deleted";
      if (order.currentState == "Confirmed") state = "Deleted";
    }
    try {
      const response = await axios.post(
        baseUrl + `orders/${order._id}`,
        {
          currentState: state,
        },
        this.getHeaders()
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  getHeaders() {
    const token = localStorage.getItem("custom-orders-token") || "";
    return {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
  }

  render() {
    return (
      <div>
        <div className="fixed-top navbar-home">
          <div className="row justify-content-between">
            <div className="col-auto">
              <span className="img">
                <img src="/americano.png" alt="logo sham" />
              </span>
              <span className="title">
                BURGER <span className="yellow">ORDERS</span>
              </span>
            </div>
            <div
              className="col-auto"
              onClick={() => this.props.onPageChange("tavoli")}
            >
              <div className="allign-right-title cursor-pointer">
                <div className="menu-icon">
                  <i className="fas fa-utensils cursor-pointer" />
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
              page="cucina"
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
              page="cucina"
              onAction={this.handleButtons}
              tables={this.handleFiltering(this.props.tables, "Ready")}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Comande;
