import React, { Component } from "react";
import axios from "axios";
import QrCode from "./common/QrCode";
const baseUrl = "https://custom-orders.smontanari.com/api/";
const frontBaseUrl = "https://custom-orders.smontanari.com/";

class MrQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTableName: "",
      newTableId: "",
      tables: [],
      table: null,
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
      this.setState({
        newTableId: response.data._id,
        newTableName: "",
        table: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <div>
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
                onClick={() => this.props.onPageChange("cassa")}
              >
                <div className="allign-right-title cursor-pointer">
                  <div className="menu-icon">
                    <i className="fas fa-qrcode cursor-pointer" />
                  </div>
                  <div className="menu-subtitle">QR CODE</div>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-container">
            <div className="white m-2">
              <h1 className="white">Crea nuovo tavolo</h1>
              <div className="mb-3">
                <input
                  className="form-control"
                  id="tableNumberInput"
                  aria-describedby="Nome o numero del tavolo"
                  value={this.state.newTableName}
                  onChange={({ currentTarget: input }) =>
                    this.setState({ newTableName: input.value })
                  }
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.keyCode == 13) {
                      event.preventDefault();
                      event.target.blur();
                      this.handleSubmit();
                    }
                  }}
                />
                <div id="tableNumberInputHelp" className="form-text">
                  Inserisci il numero del tavolo.
                </div>
              </div>
              <button
                className="btn btn-light create-table-button"
                onClick={() => this.handleSubmit()}
              >
                Crea tavolo
              </button>
              <QrCode
                onClose={() => {
                  this.setState({ table: null });
                }}
                table={this.state.table}
                idRistorante={this.props.idRistorante}
                onUpdate={() => {
                  console.log("cambiato lo stato del tavolo");
                }}
                isAdmin={true}
                canEditOrders={false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MrQR;
