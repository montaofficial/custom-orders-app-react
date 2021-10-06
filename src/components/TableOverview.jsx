import React, { Component } from "react";
import QrCode from "./common/QrCode";
const axios = require("axios");
const baseUrl = "https://custom-orders.smontanari.com/api/";
const frontBaseUrl = "https://custom-orders.smontanari.com/";

class TableOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      popup: null,
      showClosed: false,
    };
  }

  getHeaders () {
    const token = localStorage.getItem('custom-orders-token') || "";
    return {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
      },
    }
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        baseUrl + `${this.props.idRistorante}/tables`,
        this.getHeaders()
      );
      response.data.sort(function (a, b) {
        return a.name - b.name;
      });

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
          canEditOrders={true}
          isAdmin={true}
        />
        <div className="fixed-top navbar-home">
          <div className="row justify-content-between">
            <div className="col-auto">
              <span className="img">
                <img src="/logo-sham-low.svg" alt="logo sham" />
              </span>
              <span className="title">
                BURGER <span className="yellow">ORDERS</span>
              </span>
            </div>
            <div className="col-auto allign-right-title">
              <div className="row">
                <div className="col-auto tuttoaddestra">
                  <div className="menu-icon">
                    <i className="fas fa-sync-alt" />
                  </div>
                  <div
                    className="menu-subtitle"
                    onClick={() => this.componentDidMount()}
                  >
                    REFRESH
                  </div>
                </div>
                <div
                  className="col-auto"
                  onClick={() => this.props.onPageChange("qr")}
                >
                  <div className="menu-icon">
                    <i className="fas fa-utensils cursor-pointer" />
                  </div>
                  <div className="menu-subtitle">TAVOLI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-container">
          <h1 className="white">Tavoli Attivi</h1>
          <div className="row d-flex justify-content-start">
            {this.state.tables
              .filter((t) => t.state === "active")
              .map((table, key) => (
                <div
                  className="col-6 col-md-4 col-lg-3 px-3"
                  key={key}
                  onClick={() => this.setState({ popup: table })}
                >
                  <div className="rounded table-container">
                    <h1 className="yellow">{table.name}</h1>
                  </div>
                </div>
              ))}
          </div>
          {this.state.tables.filter((t) => t.state === "closed").length ? (
            <div>
              <div
                className="row  mt-3"
                onClick={() =>
                  this.setState({ showClosed: !this.state.showClosed })
                }
              >
                <div className="col-auto">
                  <h1 className="white">Tavoli Chiusi</h1>
                </div>
                <div className="col-auto cursor-pointer tuttoassinistra">
                  <div className="white">
                    {this.state.showClosed ? "[nascondi]" : "[mostra]"}
                  </div>
                </div>
              </div>
              {this.state.showClosed ? (
                <div className="row d-flex justify-content-start">
                  {this.state.tables
                    .filter((t) => t.state === "closed")
                    .map((table, key) => (
                      <div
                        className="col-6 col-md-4 col-lg-3 px-3"
                        key={key}
                        onClick={() => this.setState({ popup: table })}
                      >
                        <div className="rounded table-container">
                          <h1 className="yellow">{table.name}</h1>
                        </div>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

export default TableOverview;
