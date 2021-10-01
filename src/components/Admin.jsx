import React, { Component } from "react";
import Order from "./common/Order";
import axios from "axios";
import _ from "lodash";
const baseUrl = "https://custom-orders.smontanari.com/api/";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = { bill: false };
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
      showDone: false,
      showDeleted: false,
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

    //If category = Done or Deleted, ordering table by number
    if (filter === "Done" || filter === "Deleted") {
      filtered = filtered.sort(function (a, b) {
        return a.number - b.number;
      });
    }
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
              <span className="img">
                <img src="/logo-sham.png" alt="logo sham" />
              </span>
              <span className="title">
                BURGER <span className="yellow">ORDERS</span>
              </span>
            </div>
            <div
              className="col-auto"
              onClick={() => this.props.onPageChange("cucina")}
            >
              <div className="allign-right-title cursor-pointer">
                <div className="menu-icon">
                  <i className="fas fa-cash-register cursor-pointer" />
                </div>
                <div className="menu-subtitle">CASSA</div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-container">
          <div className="menu-section min-h-200">
            <h4>Richieste servizio</h4>
            <div className="row justify-content-start">
              {this.props.waiterRequests.map((request, key) => (
                <div
                  className="col-3 col-md-2 col-xl-1 alert-button button-small"
                  key={key}
                >
                  <i className="fas fa-user-tie"></i> {request.tableName}
                </div>
              ))}
            </div>
            <div className="row justify-content-start">
              {this.props.billRequests.map((request, key) => (
                <div
                  className="col-3 col-md-2 col-xl-1 alert-button-bill button-small"
                  key={key}
                >
                  <i className="fas fa-file-invoice-dollar"></i>{" "}
                  {request.tableName}
                </div>
              ))}
            </div>
          </div>
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
            <div
              className="row"
              onClick={() =>
                this.setState({ showDeleted: !this.state.showDeleted })
              }
            >
              <div className="col-auto">
                <h1 className="white">Deleted</h1>
              </div>
              <div className="col-auto cursor-pointer tuttoassinistra">
                <div className="white">
                  {this.state.showDeleted ? "[nascondi]" : "[mostra]"}
                </div>
              </div>
            </div>
            {this.state.showDeleted ? (
              <Order
                page="cassa"
                onAction={this.handleButtons}
                tables={this.handleFiltering(this.props.tables, "Deleted")}
              />
            ) : null}
          </div>
          <div>
            <div
              className="row"
              onClick={() => this.setState({ showDone: !this.state.showDone })}
            >
              <div className="col-auto">
                <h1 className="white">Done</h1>
              </div>
              <div className="col-auto cursor-pointer tuttoassinistra">
                <div className="white">
                  {this.state.showDone ? "[nascondi]" : "[mostra]"}
                </div>
              </div>
            </div>
            {this.state.showDone ? (
              <Order
                page="cassa"
                onAction={this.handleButtons}
                tables={this.handleFiltering(this.props.tables, "Done")}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
