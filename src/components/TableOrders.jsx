import React, { Component } from "react";
import Order from "./common/Order";
import QrCode from "./common/QrCode";
import axios from "axios";
const baseUrl = "https://custom-orders.smontanari.com/api/";

class tableOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      table: null,
      bill: true,
      waiter: null,
      waiterBlink: false,
    };
  }

  checkIfMounted() {
    return this.mounted;
  }

  componentDidMount() {
    this.mounted = true;
    this.connect();
    this.timer = setInterval(() => {
      if (this.state.waiter) {
        this.setState({ waiterBlink: !this.state.waiterBlink });
      }
    }, 800);
  }

  connect() {
    this.ws = new WebSocket(
      "wss://custom-orders.smontanari.com/api/orders/" +
        this.props.idRistorante +
        "/" +
        this.props.idTavolo
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

        return this.setState({ orders: body.orders.reverse() });
      }
      if (body.shape == "custom-orders.v1.calls") {
        console.log("Updated!");
        if (
          !body.calls ||
          !body.calls.length ||
          !body.calls.filter((c) => c.currentState === "waiting").length
        ) {
          return this.setState({ waiter: null, waiterBlink: false });
        }
        let calls = body.calls.filter((c) => c.currentState === "waiting");

        return this.setState({
          waiter: calls[calls.length - 1],
          waiterBlink: false,
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
    if (this.timer) clearInterval(this.timer);
  }

  handleButtons = async (order, action) => {
    let state = ""; // "Waiting confirmation", "Confirmed", "In preparation", "Ready", "Done", "Deleted", "Deleted by Customer"

    if (action == "btn2") {
      if (order.currentState == "Waiting confirmation")
        state = "Deleted by Customer";
      console.log(state);
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

  handleQrCode = () => {
    this.setState({ table: { _id: this.props.idTavolo, name: "Scansiona" } });
  };

  async handleWaiterCall(type) {
    if (!this.state.waiter) {
      try {
        const response = await axios.post(
          baseUrl + `${this.props.idRistorante}/calls`,
          {
            table: this.props.idTavolo,
            type: type,
          }
        );
        this.setState({ waiter: response.data });
      } catch (e) {
        console.log(e.message);
      }
    } else {
      try {
        const response = await axios.post(
          baseUrl + `calls/${this.state.waiter._id}`,
          {
            currentState: "deleted",
          }
        );
        if (response.data) {
          this.setState({ waiter: null, waiterBlink: false });
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }

  render() {
    return (
      <>
        <QrCode
          onClose={() => {
            this.setState({ table: null });
          }}
          table={this.state.table}
          idRistorante={this.props.idRistorante}
          canEditOrders={false}
          isAdmin={false}
        />
        <div className="fixed-top navbar-home">
          <div className="row justify-content-between">
            <div className="col-auto">
              <span className="img">
                <img src="/logo-sham-low.svg" alt="logo sham" />
              </span>
              <span className="title">
                CREA IL <span className="yellow"> TUO BURGER</span>
              </span>
            </div>
            <div className="col-auto allign-right-title">
              <div className="row">
                <div
                  className="col-auto tuttoaddestra"
                  onClick={() => this.handleQrCode()}
                >
                  <div className="menu-icon">
                    <i className="fas fa-user-plus" />
                  </div>
                  <div className="menu-subtitle">QR</div>
                </div>
                <div
                  className="col-auto"
                  onClick={() => this.props.onPageChange("menu")}
                >
                  <div className="menu-icon">
                    <i className="fas fa-clipboard-list" />
                  </div>
                  <div className="menu-subtitle">MENU</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-container">
          <div className="row justify-content-between menu-section">
            <h1 className="yellow">
              Tavolo{" "}
              {this.state.orders.length > 0
                ? this.state.orders[0].tableName
                : ""}
            </h1>
            <div
              className={
                "col alert-button button-small prevent-hover" +
                (this.state.waiterBlink ? " button-blink" : "")
              }
              onClick={(event) => {
                this.handleWaiterCall("waiter");
                event.preventDefault();
                event.target.blur();
              }}
            >
              {this.state.waiter?.type == "bill" ? (
                <i className="fas fa-file-invoice-dollar"></i>
              ) : (
                <i className="fas fa-user-tie"></i>
              )}
              {this.state.waiter ? " ANNULLA CHIAMATA" : " CAMERIERE"}
            </div>

            {!this.state.waiter && this.state.bill ? (
              <div
                className={
                  "col alert-button button-small prevent-hover" +
                  (this.state.waiterBlink ? " button-blink" : "")
                }
                onClick={(event) => {
                  this.handleWaiterCall("bill");
                  event.preventDefault();
                  event.target.blur();
                }}
              >
                <i className="fas fa-file-invoice-dollar"></i>
                {this.state.waiter ? " ANNULLA CHIAMATA" : " CHIEDI CONTO"}
              </div>
            ) : null}
          </div>

          {this.state.orders.filter(
            (order) =>
              order.currentState !== "Deleted" &&
              order.currentState !== "Deleted by Customer" &&
              order.currentState !== "Done"
          ).length ? (
            <Order
              page="tableOrders"
              onAction={this.handleButtons}
              tables={[
                {
                  number: this.state.orders[0].tableName + " ORDINE",
                  orders: this.state.orders.filter(
                    (order) =>
                      order.currentState !== "Deleted" &&
                      order.currentState !== "Deleted by Customer" &&
                      order.currentState !== "Done"
                  ),
                },
              ]}
            />
          ) : null}
          <div className="transparent">
            {this.state.orders.filter((order) => order.currentState === "Done")
              .length ? (
              <Order
                page="tableOrders"
                onAction={this.handleButtons}
                tables={[
                  {
                    number: this.state.orders[0].tableName + " CONSEGNATI",
                    orders: this.state.orders.filter(
                      (order) => order.currentState === "Done"
                    ),
                  },
                ]}
              />
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

export default tableOrders;
