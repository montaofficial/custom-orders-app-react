import React, { Component } from "react";
import QrCode from "./common/QrCode";
const axios = require("axios");
const baseUrl = "https://custom-orders.smontanari.com/api/";
const frontBaseUrl = "http://192.168.1.84:3000/";

class TableOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      popup: null,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        baseUrl + `${this.props.idRistorante}/tables`
      );

      this.setState({ tables: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <>
        <QrCode
          onClose={() => {
            this.setState({ popup: null });
          }}
          table={this.state.popup}
          idRistorante={this.props.idRistorante}
          onUpdate={() => this.componentDidMount()}
          isAdmin={true}
        />
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
              onClick={() => this.props.onPageChange("qr")}
            >
              <div className="allign-right-title cursor-pointer">
                <div className="menu-icon">
                  <i className="fas fa-utensils cursor-pointer" />
                </div>
                <div className="menu-subtitle">TAVOLI</div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-container">
          <h1 className="white">Tavoli Attivi</h1>
          {this.state.tables
            .filter((t) => t.state === "active")
            .map((table, key) => (
              <div
                className="row justify-content-between table-container "
                key={key}
                onClick={() => this.setState({ popup: table })}
              >
                <div className="col-auto">
                  <h1 className="yellow">{table.name}</h1>
                </div>
              </div>
            ))}
          <h1 className="white">Tavoli Chiusi</h1>
          {this.state.tables
            .filter((t) => t.state === "closed")
            .map((table, key) => (
              <div
                className="table-container"
                key={key}
                onClick={() => this.setState({ popup: table })}
              >
                {table.name}
              </div>
            ))}
        </div>
      </>
    );
  }
}

export default TableOverview;
