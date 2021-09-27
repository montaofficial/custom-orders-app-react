import React, { Component } from "react";
const axios = require("axios");
const baseUrl = "https://custom-orders.smontanari.com/api/";
const frontBaseUrl = "http://192.168.1.84:3000/";

class QrCode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  copy(url) {
    navigator.clipboard.writeText(url);
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
      this.props.onUpdate();
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    if (!this.props.table) return null;
    return (
      <>
        <div id="dialog_base" onClick={() => this.props.onClose()}></div>
        <div id="dialog_content">
          <div className="card alert-box">
            <div className="alert-text">
              <h4>{this.props.table.name}</h4>
              {this.props.isAdmin ? (
                <>
                  {this.props.table.state == "active" ? (
                    <div
                      className="alert-button button-small"
                      onClick={() => {
                        window.open(
                          `${frontBaseUrl}${this.props.idRistorante}/${this.props.table._id}`,
                          "_blank"
                        );
                      }}
                    >
                      MODIFICA ORDINE
                    </div>
                  ) : null}
                  <div
                    className="alert-button button-small"
                    onClick={() => {
                      this.props.onClose();
                      this.editOrders(
                        this.props.table._id,
                        this.props.table.state == "active" ? "closed" : "active"
                      );
                    }}
                  >
                    {this.props.table.state == "active" ? "CHIUDI" : "RIATTIVA"}{" "}
                    ORDINI
                  </div>
                </>
              ) : (
                <div
                  className="alert-button button-small"
                  onClick={() => {
                    this.copy(
                      `${frontBaseUrl}${this.props.idRistorante}/${this.props.table._id}`
                    );
                    this.props.onClose();
                  }}
                >
                  COPIA LINK
                </div>
              )}
              {this.img(this.props.table._id)}
            </div>
            <div className="row justify-content-center mt-4">
              <div
                className="col-auto alert-button"
                onClick={() => this.props.onClose()}
              >
                CHIUDI QR
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function genQrLink(link) {
  if (link === "") return "not-founds";
  return `https://image-charts.com/chart?chs=900x900&cht=qr&choe=UTF-8&chl=${encodeURIComponent(
    link
  )}`;
}

export default QrCode;
