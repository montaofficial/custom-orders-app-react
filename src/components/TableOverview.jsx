import React, { Component } from "react";
const axios = require("axios");
const baseUrl = "https://custom-orders.smontanari.com/api/";

class TableOverview extends Component {
  constructor(props) {
    super(props);
    this.state = { tables: [] };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        baseUrl + `${this.props.idRistorante}/tables`
      );
      console.log(response.data);
      this.setState({ tables: response.data });
    } catch (error) {
      console.error(error);
    }
  }

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
              onClick={() => this.props.onPageChange("qr")}
            >
              <div className="allign-right-title">
                <div className="menu-icon">
                  <i className="fas fa-utensils" />
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
              <div className="table-container">{table.name}</div>
            ))}
          <h1 className="white">Tavoli Chiusi</h1>
          {this.state.tables
            .filter((t) => t.state === "closed")
            .map((table, key) => (
              <div className="table-container">{table.name}</div>
            ))}
        </div>
      </div>
    );
  }
}

export default TableOverview;
