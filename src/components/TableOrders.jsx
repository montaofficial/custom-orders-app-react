import React, { Component } from "react";
import Order from "./common/Order";
import QrCode from "./common/QrCode";
import axios from "axios";
const baseUrl = "https://custom-orders.smontanari.com/api/";

class tableOrders extends Component {
  constructor(props) {
    super(props);
    this.state = { orders: [], table: null };
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

        this.setState({ orders: body.orders });
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

  render() {
    return (
      <>
        <QrCode
          onClose={() => {
            this.setState({ table: null });
          }}
          table={this.state.table}
          idRistorante={this.props.idRistorante}
        />
        <div className="fixed-top navbar-home">
          <div className="row justify-content-between">
            <div className="col-auto">
              <inline className="img">
                <img src="/logo-sham.png" alt="logo sham" />
              </inline>
              <inline className="title">
                CREA IL <inline className="yellow"> TUO BURGER</inline>
              </inline>
            </div>
            <div className="col-auto allign-right-title">
              <div className="row">
                <div className="col-auto">
                  <div className="menu-icon">
                    <i
                      className="fas fa-user-plus"
                      onClick={() => this.handleQrCode()}
                    />
                  </div>
                  <div className="menu-subtitle">QR</div>
                </div>
                <div className="col-auto">
                  <div className="menu-icon">
                    <i
                      className="fas fa-clipboard-list"
                      onClick={() => this.props.onPageChange("menu")}
                    />
                  </div>
                  <div className="menu-subtitle">MENU</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-container">
          {this.state.orders.length ? (
            <Order
              page="tableOrders"
              onAction={this.handleButtons}
              tables={[
                {
                  number: this.state.orders[0].tableName,
                  orders: this.state.orders.filter(
                    (order) =>
                      order.currentState !== "Deleted" &&
                      order.currentState !== "Deleted by Customer"
                  ),
                },
              ]}
            />
          ) : null}
        </div>
      </>
    );
  }
}

export default tableOrders;
