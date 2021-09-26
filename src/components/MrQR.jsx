import React, { Component } from "react";
import axios from "axios";
const baseUrl = "https://custom-orders.smontanari.com/api/";
const frontBaseUrl = "http://192.168.1.84:3000/";

class MrQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTableName: "",
      newTableId: "",
      tables: [],
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

  handleSubmit = async () => {
    try {
      const response = await axios.post(
        baseUrl + `${this.props.idRistorante}/tables`,
        { name: this.state.newTableName }
      );
      this.setState({ newTableId: response.data._id, newTableName: "" });
    } catch (error) {
      console.error(error);
    }
  };

  handleChange = ({ currentTarget: input }) => {
    let newTableName = this.state.newTableName;
    newTableName = input.value;
    genQrLink(newTableName);
    this.setState({ newTableName });
  };

  img = (str) => {
    if (str === "") return "";
    else
      return (
        <img
          className="img-fluid invert-img rounded qr-image"
          src={genQrLink(
            `${frontBaseUrl}${this.props.idRistorante}/${this.state.newTableId}`
          )}
          alt="qr link"
        />
      );
  };

  render() {
    return (
      <div>
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
                onClick={() => this.props.onPageChange("cassa")}
              >
                <div className="allign-right-title">
                  <div className="menu-icon">
                    <i className="fas fa-qrcode" />
                  </div>
                  <div className="menu-subtitle">QR CODE</div>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-container">
            <div className="white m-2">
              <h1 className="white">Crea nuovo tavolo</h1>
              <form>
                <div className="mb-3">
                  <input
                    className="form-control"
                    id="tableNumberInput"
                    aria-describedby="Nome o numero del tavolo"
                    value={this.state.newTableName}
                    onChange={this.handleChange}
                    autoFocus
                  />
                  <div id="tableNumberInputHelp" className="form-text">
                    Inserisci il numero del tavolo.
                  </div>
                </div>
              </form>
              <button
                className="btn btn-light create-table-button"
                onClick={() => this.handleSubmit()}
              >
                Crea tavolo
              </button>
              {this.img(this.state.newTableId)}
            </div>
          </div>
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

export default MrQR;
