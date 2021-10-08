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

  getHeaders() {
    const token = localStorage.getItem("custom-orders-token") || "";
    return {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
  }

  handleIngredients = (order) => {
    const elements = order.ingredients.join(", ");
    return elements;
  };
  // "Waiting confirmation", "Confirmed", "In preparation", "Ready", "Done", "Deleted", "Deleted by Customer"
  handleFiltering = (tables, filter) => {
    let filtered = [];
    let orders = [];
    let table = {
      number: 0,
      orders: [],
      showWaiting: false,
      showConfirmed: false,
      showPreparation: false,
      showReady: false,
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

  async handleWaiterCall(type) {
    try {
      const response = await axios.post(
        baseUrl + `calls/${type._id}`,
        {
          currentState: "served",
        },
        this.getHeaders()
      );
    } catch (e) {
      console.log(e.message);
    }
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
              onClick={() => this.props.onPageChange("cucina")}
            >
              <div className="allign-right-title cursor-pointer">
                <div className="menu-icon">
                  <i
                    className={
                      this.props.waiter
                        ? "fas fa-user-alt  cursor-pointer"
                        : "fas fa-cash-register cursor-pointer"
                    }
                  />
                </div>
                <div className="menu-subtitle">
                  {this.props.waiter ? "CAMERIERE" : "CASSA"}
                </div>
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
                  onClick={() => {
                    this.handleWaiterCall(request);
                  }}
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
                  onClick={() => {
                    this.handleWaiterCall(request);
                  }}
                  key={key}
                >
                  <i className="fas fa-file-invoice-dollar"></i>{" "}
                  {request.tableName}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div
              className="row"
              onClick={() =>
                this.setState({ showWaiting: !this.state.showWaiting })
              }
            >
              <div className="col-auto">
                <h1 className="white">Waiting confirmation</h1>
              </div>
              <div className="col-auto cursor-pointer tuttoassinistra">
                <div className="white">
                  {this.state.showWaiting ? "[nascondi]" : "[mostra] "}{" "}
                  <span className="col-auto badge rounded-pill bg-warning how-many-badge">
                    {
                      this.handleFiltering(
                        this.props.tables,
                        "Waiting confirmation"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
            {this.state.showWaiting ? (
              <Order
                page="cassa"
                onAction={this.handleButtons}
                tables={this.handleFiltering(
                  this.props.tables,
                  "Waiting confirmation"
                )}
              />
            ) : null}
          </div>
          <div>
            <div
              className="row"
              onClick={() =>
                this.setState({ showConfirmed: !this.state.showConfirmed })
              }
            >
              <div className="col-auto">
                <h1 className="white">Confirmed</h1>
              </div>
              <div className="col-auto cursor-pointer tuttoassinistra">
                <div className="white">
                  {this.state.showConfirmed ? "[nascondi]" : "[mostra]"}{" "}
                  <span className="col-auto badge rounded-pill bg-warning how-many-badge">
                    {
                      this.handleFiltering(this.props.tables, "Confirmed")
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>
            {this.state.showConfirmed ? (
              <Order
                page="cassa"
                onAction={this.handleButtons}
                tables={this.handleFiltering(this.props.tables, "Confirmed")}
              />
            ) : null}
          </div>
          <div>
            <div
              className="row"
              onClick={() =>
                this.setState({ showPreparation: !this.state.showPreparation })
              }
            >
              <div className="col-auto">
                <h1 className="white">In preparation</h1>
              </div>
              <div className="col-auto cursor-pointer tuttoassinistra">
                <div className="white">
                  {this.state.showPreparation ? "[nascondi]" : "[mostra]"}{" "}
                  <span className="col-auto badge rounded-pill bg-warning how-many-badge">
                    {
                      this.handleFiltering(this.props.tables, "In preparation")
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>
            {this.state.showPreparation ? (
              <Order
                page="cassa"
                onAction={this.handleButtons}
                tables={this.handleFiltering(
                  this.props.tables,
                  "In preparation"
                )}
              />
            ) : null}
          </div>
          <div>
            <div
              className="row"
              onClick={() =>
                this.setState({ showReady: !this.state.showReady })
              }
            >
              <div className="col-auto">
                <h1 className="white">Ready</h1>
              </div>
              <div className="col-auto cursor-pointer tuttoassinistra">
                <div className="white">
                  {this.state.showReady ? "[nascondi]" : "[mostra]"}{" "}
                  <span className="col-auto badge rounded-pill bg-warning how-many-badge">
                    {this.handleFiltering(this.props.tables, "Ready").length}
                  </span>
                </div>
              </div>
            </div>
            {this.state.showReady ? (
              <Order
                page="cassa"
                onAction={this.handleButtons}
                tables={this.handleFiltering(this.props.tables, "Ready")}
              />
            ) : null}
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
                  {this.state.showDeleted ? "[nascondi]" : "[mostra]"}{" "}
                  <span className="col-auto badge rounded-pill bg-warning how-many-badge">
                    {this.handleFiltering(this.props.tables, "Deleted").length}
                  </span>
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
                  {this.state.showDone ? "[nascondi]" : "[mostra]"}{" "}
                  <span className="col-auto badge rounded-pill bg-warning how-many-badge">
                    {this.handleFiltering(this.props.tables, "Done").length}
                  </span>
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
