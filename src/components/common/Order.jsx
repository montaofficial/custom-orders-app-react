import React, { Component } from "react";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = { page: this.props.page };
  }

  handleIngredients = (order) => {
    let elements = "";
    if (order.type !== "Crostone") {
      elements = order.ingredients.join(", ");
    } else {
      elements = order.ingredients;
    }
    return elements;
  };

  handleConfirmButton = (order) => {
    let state = order.currentState;
    let page = this.state.page;
    let cl = "";
    let text = "";
    if (state === "Waiting confirmation" && page === "cassa") {
      cl = "fas fa-check-circle cursor-pointer";
      text = "Conferma";
    }
    if (state === "Deleted" && page === "cassa") {
      cl = "fas fa-check-circle cursor-pointer";
      text = "Recupera";
    }
    if (state === "Confirmed" && page === "cucina") {
      cl = "fas fa-bacon cursor-pointer";
      text = "Prepara";
    }
    if (state === "In preparation" && page === "cucina") {
      cl = "fas fa-check-circle cursor-pointer";
      text = "Pronto";
    }
    if (state === "Ready" && page === "cassa") {
      cl = "fas fa-check-circle cursor-pointer";
      text = "Consegnati";
    }
    if (state === "In preparation" && page === "tableOrders") {
      cl = "fas fa-bacon";
      text = "In preparazione";
    }
    if (state === "Ready" && page === "tableOrders") {
      cl = "fas fa-check-circle";
      text = "Pronto";
    }
    if (state === "Confirmed" && page === "tableOrders") {
      cl = "fas fa-check-circle";
      text = "Accettato";
    }

    return [cl, text];
  };

  handleDeleteButton = (order) => {
    let state = order.currentState;
    let page = this.state.page;
    let cl = "";
    let text = "";
    if (state === "Waiting confirmation" && page === "cassa") {
      cl = "fas fa-times-circle cursor-pointer";
      text = "Elimina";
    }
    if (state === "Confirmed" && page === "cassa") {
      cl = "fas fa-times-circle cursor-pointer";
      text = "Elimina";
    }
    if (state === "Waiting confirmation" && page === "tableOrders") {
      cl = "fas fa-times-circle cursor-pointer";
      text = "Annulla";
    }

    return [cl, text];
  };

  handleOrderType = (order) => {
    let orderMod = order;
    if (order.type === "Appetizer") {
      if (order.ingredients[0] === "Crostone 1") {
        orderMod.type = "Crostone";
        orderMod.ingredients = "";
        orderMod.ingredients = order.details;
      }
      if (order.ingredients[0] === "Crostone 2") {
        orderMod.type = "Crostone";
        orderMod.ingredients = "";
        orderMod.ingredients = order.details;
      }
      if (order.ingredients[0] === "Crostone 3") {
        orderMod.type = "Crostone";
        orderMod.ingredients = "";
        orderMod.ingredients = order.details;
      }
      if (order.ingredients[0] === "Crostone 4") {
        orderMod.type = "Crostone";
        orderMod.ingredients = "";
        orderMod.ingredients = order.details;
      }
      if (order.ingredients[0] === "Crostone 5") {
        orderMod.type = "Crostone";
        orderMod.ingredients = "";
        orderMod.ingredients = order.details;
      }
    }

    return orderMod;
  };

  handleIcon = (type) => {
    if (type === "Burger") return "fas fa-hamburger";
    if (type === "Appetizer") return "fas fa-drumstick-bite";
    if (type === "Crostone") return "fas fa-bread-slice";
  };

  render() {
    return (
      <div>
        {this.props.tables.map((table, key) => (
          <div className="menu-section" key={key}>
            <div className="orders-section">
              <div className="row justify-content-between">
                <div className="col-auto order-section-title">
                  Tavolo {table.number}
                </div>
                <div className="col-auto"></div>
              </div>
              {table.orders.map((order, key2) => {
                const [button1, button1Text] = this.handleConfirmButton(order);
                const [button2, button2Text] = this.handleDeleteButton(order);

                return (
                  <div className="order-section-element" key={key + "" + key2}>
                    <div className="row justify-content-between">
                      <div className="col-auto order-section-title">
                        <i
                          className={this.handleIcon(
                            this.handleOrderType(order).type
                          )}
                        />
                        {this.handleOrderType(order).type}
                        <div>
                          <span className="badge rounded-pill bg-success price-badge">
                            {this.state.page === "cassa" ||
                            (this.state.page === "tableOrders" &&
                              order.currentState !== "Waiting confirmation")
                              ? order.price + " €"
                              : null}
                          </span>
                        </div>
                      </div>
                      <div className="col-auto row justify-content">
                        {button1 ? (
                          <div className="col-auto admin-button">
                            <div className="menu-icon">
                              <i
                                className={button1}
                                onClick={() =>
                                  this.props.onAction(order, "btn1")
                                }
                              />
                            </div>
                            <div className="menu-subtitle">{button1Text}</div>
                          </div>
                        ) : null}
                        {button2 ? (
                          <div className="col-auto admin-button">
                            <div className="menu-icon">
                              <i
                                className={this.handleDeleteButton(order)}
                                onClick={() =>
                                  this.props.onAction(order, "btn2")
                                }
                              />
                            </div>
                            <div className="menu-subtitle">{button2Text}</div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col white">
                      {this.handleIngredients(order)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Order;
