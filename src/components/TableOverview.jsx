import React, { Component } from "react";
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
      console.log(response.data);
      this.setState({ tables: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  img = (str) => {
    if (str === "") return "";
    else
      return (
        <img
          className="img-fluid invert-img rounded"
          src={genQrLink(`${frontBaseUrl}${this.props.idRistorante}/${str}`)}
          alt="qr link"
        />
      );
  };

  async editOrders(id, state) {
    try {
      const response = await axios.post(baseUrl + `tables/${id}`, { state });
      console.log(response.data);
      try {
        const response = await axios.get(
          baseUrl + `${this.props.idRistorante}/tables`
        );
        console.log(response.data);
        this.setState({ tables: response.data });
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div>
        {this.state.popup ? (
          <>
            <div
              id="dialog_base"
              onClick={() => this.setState({ popup: null })}
            ></div>
            <div id="dialog_content">
              <div className="card alert-box">
                <div className="alert-text">
                  <h4>{this.state.popup.name}</h4>
                  <div
                    className="alert-button button-small"
                    onClick={() => {
                      this.setState({ popup: null });
                      this.editOrders(
                        this.state.popup._id,
                        this.state.popup.state == "active" ? "closed" : "active"
                      );
                    }}
                  >
                    {this.state.popup.state == "active" ? "CHIUDI" : "RIATTIVA"}{" "}
                    ORDINI
                  </div>
                  {this.img(this.state.popup._id)}
                </div>
                <div className="row justify-content-center mt-4">
                  <div
                    className="col-auto alert-button"
                    onClick={() => this.setState({ popup: null })}
                  >
                    CHIUDI QR
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
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
                className="table-container"
                key={key}
                onClick={() => this.setState({ popup: table })}
              >
                {table.name}
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
      </div>
    );
  }
}

function genQrLink(link) {
  if (link === "") return "not-founds";
  return `https://image-charts.com/chart?chs=900x900&cht=qr&choe=UTF-8&chl=${encodeURIComponent(
    link
  )}`;
}

export default TableOverview;
