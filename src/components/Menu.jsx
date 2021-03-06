import React, { Component } from "react";
import DialogBox from "./common/DialogBox";
import QrCode from "./common/QrCode";
const axios = require("axios");
const baseUrl = "https://orders-api.soolutions.net/api/";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: this.props.order,
      category: 0,
      update: false,
      popup: false,
      canConfirm: false,
      name: this.props.name,
      table: null,
      dialog: false,
    };
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
        {this.state.dialog ? (
          <DialogBox
            onClose={() => {
              this.setState({ dialog: null });
            }}
            title={"ALLERGENI"}
            text={
              <div>
                <div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Pane Burger al Latte: </span>
                      <span className="white">latte, uova</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Cheddar rosso e bianco: </span>
                      <span className="white">latte</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Guacamole: </span>
                      <span className="white">latte</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Maionese: </span>
                      <span className="white">uova</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Senape: </span>
                      <span className="white">senape</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Ranch al pepe nero: </span>
                      <span className="white">biossido di zolfo</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Chicken Nuggets: </span>
                      <span className="white">
                        frumento, orzo, soia, sedano
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Southern Fried Chicken: </span>
                      <span className="white">frumento, latte</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Granella di cipolle: </span>
                      <span className="white">frumento</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Pesto: </span>
                      <span className="white">
                        anacardi, noci, pinoli e prodotti a base di latte
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="title">
                      <span className="yellow">Sriracha: </span>
                      <span className="white">bisolfito di sodio</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        ) : null}
        <div className="fixed-top navbar-home">
          <div className="row justify-content-between">
            <div className="col-auto">
              <span className="img">
                <img src="/logo-sham-low.svg" alt="logo sham" />
              </span>
              {this.props.admin ? (
                <span className="title">
                  MODIFICA <span className="yellow"> ORDINI</span>
                </span>
              ) : (
                <span className="title">
                  CREA IL <span className="yellow"> TUO BURGER</span>
                </span>
              )}
            </div>
            <div className="col-auto allign-right-title">
              <div className="row">
                {this.props.tableOpen ? (
                  <div
                    className="col-auto tuttoaddestra"
                    onClick={() => this.handleQrCode()}
                  >
                    <div className="menu-icon">
                      <i className="fas fa-user-plus" />
                    </div>
                    <div className="menu-subtitle">QR</div>
                  </div>
                ) : null}
                {this.props.tableOpen ? (
                  <div
                    className="col-auto"
                    onClick={() => this.props.onPageChange("table")}
                  >
                    <div className="menu-icon">
                      <i className="fas fa-clipboard-list" />
                    </div>
                    <div className="menu-subtitle">ORDINI</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {this.props.tableOpenPopup ? (
          <div>
            {this.state.popup ? null : (
              <div>
                {this.props.tableOpen ? (
                  <div
                    className="fixed-bottom submit-order rounded"
                    onClick={() => this.submitOrder()}
                  >
                    ORDINA
                  </div>
                ) : null}
              </div>
            )}
            {this.state.popup ? (
              <div className="menu-cliente">
                <div className="menu-section rounded">
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
                      className="submit-order rounded"
                      onClick={() => this.setState({ popup: false })}
                    >
                      INDIETRO
                    </div>
                    {this.state.canConfirm ? (
                      <div
                        className="submit-order rounded"
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
                {this.props.tableOpen ? (
                  <div className="mb-3">
                    <input
                      placeholder="Nome (opzionale)"
                      aria-label="name"
                      className="form-control"
                      id="name"
                      value={this.state.name}
                      onChange={({ currentTarget: input }) =>
                        this.setState({ name: input.value })
                      }
                      onKeyDown={(event) => {
                        if (event.keyCode == 13) {
                          event.preventDefault();
                          event.target.blur();
                        }
                      }}
                    />

                    <div id="tableNumberInputHelp" className="form-text">
                      Inserendo il nome sar?? pi?? semplice distinguere gli ordini
                    </div>
                  </div>
                ) : null}
                {this.props.options.map((category, key) => (
                  <div className="menu-section rounded" key={key}>
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
                          <div
                            className="row menu-section-element"
                            key={key + "" + key2}
                            onClick={
                              this.state.order.includes(element.name)
                                ? () => this.removeItem(element.name)
                                : () => this.addItem(element.name, category)
                            }
                          >
                            <div className="col element-name">
                              {element.name}
                              {element.vegan ? (
                                <span className="element-vegan">
                                  <i className="fas fa-leaf"></i>
                                </span>
                              ) : null}
                              {element.details ? (
                                <div className="element-description">
                                  {element.details}
                                </div>
                              ) : null}
                            </div>
                            {this.props.tableOpen ? (
                              <>
                                <div className="col-auto price">
                                  {displayPrice(element.price)}
                                </div>
                                <div className="col-auto select">
                                  {this.state.order.includes(element.name) ? (
                                    <div className="icon">
                                      <i className="fas fa-check-square"></i>
                                    </div>
                                  ) : (
                                    <div className="icon">
                                      <i className="far fa-square"></i>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                <div className="text-center mt-3">
                  <div
                    onClick={() => this.setState({ dialog: true })}
                    className="yellow underline cursor-pointer"
                  >
                    CLICCA PER GLI ALLERGENI
                  </div>
                  <div className="white mt-3">
                    Tutti i burger sono serviti con
                  </div>
                  <div className="white mt-1">
                    panino al latte e patatine fritte
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="menu-cliente">
              <div className="menu-section rounded">
                <div className="menu-section-title">Attenzione!</div>
                <div className="menu-section-body">
                  <h1 className="white">
                    Questa sessione ?? scaduta. Potrai continuare a consultare il
                    men??.
                  </h1>
                  <div
                    className="submit-order rounded"
                    onClick={() => this.props.onTableClosed2()}
                  >
                    INDIETRO
                  </div>
                </div>
              </div>
            </div>
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
    if (this.props.options[0] && this.props.options[5]) {
      let foundCarne = false;
      let foundApetizer = false;
      for (let carne of this.props.options[0].options)
        if (this.state.order.includes(carne.name)) foundCarne = true;

      for (let apet of this.props.options[5].options)
        if (this.state.order.includes(apet.name)) foundApetizer = true;

      if (!foundCarne && foundApetizer) {
        let order = this.state.order.filter((item) =>
          this.props.options[5].options
            .map((option) => option.name)
            .includes(item)
        );
        return this.setState({ popup: true, canConfirm: true, order });
      }
      if (!foundCarne && !foundApetizer) {
        return this.setState({ popup: true, canConfirm: false });
      }

      return this.postOrder();
    }
  }

  async postOrder() {
    let orderInOrder = [];

    for (let i = 0; i < this.props.options.length; i++) {
      for (let c = 0; c < this.props.options[i].options.length; c++) {
        if (this.state.order.includes(this.props.options[i].options[c].name)) {
          orderInOrder.push(this.props.options[i].options[c].name);
        }
      }
    }

    try {
      const response = await axios.post(
        baseUrl + `${this.props.idRistorante}/${this.props.idTavolo}`,
        {
          ingredients: orderInOrder,
          customer: this.state.name,
        }
      );
      console.log(response.data);
      this.props.onPageChange("table");
      this.setState({
        order: [],
        popup: false,
        category: 0,
      });
      if (this.props.admin) {
        this.props.onResetOrder();
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 400) {
        this.props.onTableClosed();
      }
    }
  }
}

function displayPrice(price) {
  if (!price) return "free";
  return `${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")} ???`;
}

export default Menu;
