import React, { Component } from "react";
import QrCode from "./common/QrCode";
const axios = require("axios");
const baseUrl = "https://custom-orders.smontanari.com/api/";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      order: [],
      category: 0,
      update: false,
      popup: false,
      canConfirm: false,

      table: null,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        baseUrl + `${this.props.idRistorante}/menu`
      );
      this.setState({ options: response.data });
    } catch (error) {
      console.error(error);
    }
  }

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
                <div className="col-auto tuttoaddestra">
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
                      onClick={() => this.props.onPageChange("table")}
                    />
                  </div>
                  <div className="menu-subtitle">ORDINI</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.popup ? null : (
          <div
            className="fixed-bottom submit-order"
            onClick={() => this.submitOrder()}
          >
            ORDINA
          </div>
        )}
        {this.state.popup ? (
          <div className="menu-cliente">
            <div className="menu-section">
              <div className="menu-section-title">Attenzione!</div>
              <div className="menu-section-body">
                Non hai selezionato carne!
                <br />
                {this.state.canConfirm
                  ? "Vuoi ordinare solo gli Apetizers?"
                  : null}
                <br />
                <br />
                <br />
                <div
                  className="submit-order"
                  onClick={() => this.setState({ popup: false })}
                >
                  INDIETRO
                </div>
                {this.state.canConfirm ? (
                  <div
                    className="submit-order"
                    onClick={() => this.postOrder()}
                  >
                    CONFERMA
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="menu-cliente">
            {this.state.options.map((category, key) => (
              <div className="menu-section" key={key}>
                <div
                  className={
                    this.state.category == key
                      ? "menu-section-title active"
                      : "menu-section-title"
                  }
                  onClick={() => {
                    this.setState({ category: key });
                  }}
                >
                  {category.name}
                </div>
                {this.state.category == key ? (
                  <div className="menu-section-list">
                    {category.options.map((element, key2) => (
                      <div className="row menu-section-element" key={key2}>
                        <div className="col element-name">
                          {element.name}
                          {element.vegan ? (
                            <inline className="element-vegan">
                              <i className="fas fa-leaf"></i>
                            </inline>
                          ) : null}
                          {element.details ? (
                            <div className="element-description">
                              {element.details}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-auto price">
                          {displayPrice(element.price)}
                        </div>
                        <div className="col-auto select">
                          {this.state.order.includes(element.name) ? (
                            <div
                              className="icon"
                              onClick={() => this.removeItem(element.name)}
                            >
                              <i className="fas fa-check-square"></i>
                            </div>
                          ) : (
                            <div
                              className="icon"
                              onClick={() =>
                                this.addItem(element.name, category)
                              }
                            >
                              <i className="far fa-square"></i>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  addItem(value, category) {
    if (category.single)
      for (let element of category.options) {
        const index = this.state.order.indexOf(element.name);
        if (index > -1) {
          this.state.order.splice(index, 1);
        }
      }
    this.state.order.push(value);
    this.setState({ update: !this.state.update });
  }

  removeItem(value) {
    var index = this.state.order.indexOf(value);
    if (index > -1) {
      this.state.order.splice(index, 1);
    }
    this.setState({ update: !this.state.update });
  }

  submitOrder() {
    console.log(this.state.order);
    if (this.state.options[0] && this.state.options[5]) {
      let foundCarne = false;
      let foundApetizer = false;
      for (let carne of this.state.options[0].options)
        if (this.state.order.includes(carne.name)) foundCarne = true;

      for (let apet of this.state.options[5].options)
        if (this.state.order.includes(apet.name)) foundApetizer = true;

      if (!foundCarne && foundApetizer)
        return this.setState({ popup: true, canConfirm: true });
      if (!foundCarne && !foundApetizer)
        return this.setState({ popup: true, canConfirm: false });

      return this.postOrder();
    }
  }

  async postOrder() {
    const response = await axios.post(
      baseUrl + `${this.props.idRistorante}/${this.props.idTavolo}`,
      this.state.order
    );
    console.log(response.data);
    this.setState({
      order: [],
      popup: false,
      category: 0,
    });
  }
}

function displayPrice(price) {
  if (!price) return "free";
  return `${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")} €`;
}

export default Menu;
