import React, { Component } from "react";
import Product from "./common/Product";
import DialogBox from "./common/DialogBox";
const axios = require("axios");
const baseUrl = "https://orders-api.soolutions.net/api/";

class ModifyMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: [],
      product: null,
      category: null,
      new: false,
      valid: true,
      newCategory: false,
      dialog: false,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        baseUrl + `${this.props?.match?.params?.idRistorante}/menu/tavolo`
      );
      this.setState({
        menu: response.data.menu,
        table: response.data.table,
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleModifyMenu = (prod, d) => {
    if (prod.name && prod.price) {
      let modMenu = this.state.menu;
      const c = this.state.menu.findIndex((c) => c === this.state.category);

      if (d) {
        const modOptions = modMenu[c].options.filter((p) => p._id !== prod._id);
        modMenu[c].options = modOptions;
      } else {
        if (this.state.new) {
          modMenu[c].options.push(prod);
        } else {
          const p = this.state.menu[c].options.findIndex(
            (p) => p._id === prod._id
          );
          modMenu[c].options[p] = prod;
        }
      }

      this.setState({
        menu: modMenu,
        product: null,
        category: null,
        new: false,
        valid: true,
      });
    } else {
      this.setState({ valid: false });
    }
  };

  handleSaveMenu = () => {
    console.log(this.state.menu);
    this.setState({ dialog: false });
  };

  render() {
    return (
      <>
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
            <div className="col-auto">
              <div
                className="allign-right-title cursor-pointer"
                onClick={() => this.setState({ dialog: true })}
              >
                <div className="menu-icon">
                  <i className="fas fa-save cursor-pointer" />
                </div>
                <div className="menu-subtitle">SALVA</div>
              </div>
            </div>
          </div>
        </div>

        {this.state.dialog ? (
          <DialogBox
            onClose={() => {
              this.setState({ dialog: null });
            }}
            onSaveMenu={() => this.handleSaveMenu()}
          />
        ) : null}

        {this.state.product ? (
          <Product
            onMod={(prod, d) => this.handleModifyMenu(prod, d)}
            onClose={() => {
              this.setState({ product: null, category: null, valid: true });
            }}
            product={this.state.product}
            new={this.state.new}
            valid={this.state.valid}
          />
        ) : null}

        <div className="admin-container">
          {this.state.menu.map((o, key) => (
            <div className="menu-section rounded" key={key}>
              <div className="menu-section-title">
                {o.name}
                <div className="menu-section-list">
                  {o.options.map((op, key2) => (
                    <div
                      className={
                        "row menu-section-element" +
                        (op.unavailable ? " transparent-more" : "")
                      }
                      key={key2}
                    >
                      <div className="col element-name">
                        {op.name}
                        {op.vegan ? (
                          <span className="element-vegan">
                            <i className="fas fa-leaf"></i>
                          </span>
                        ) : null}
                        <div className="element-description">{op.details}</div>
                      </div>
                      <div className="col-auto price">{op.price}€</div>
                      <div className="col-auto price">
                        <div className="row">
                          <div className="col-auto">
                            <button
                              type="button"
                              className="btn btn-warning"
                              onClick={() =>
                                this.setState({ product: op, category: o })
                              }
                            >
                              <i className="fas fa-edit" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="row justify-content-center menu-section-element">
                    <div className="col-auto">
                      <button
                        type="button"
                        className="add-button"
                        onClick={() => {
                          this.setState({
                            category: o,
                            new: true,
                            product: {
                              name: "",
                              price: "",
                              details: "",
                              vegan: false,
                              unavailable: false,
                            },
                          });
                        }}
                      >
                        <i className="fas fa-plus" /> AGGIUNGI
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default ModifyMenu;
