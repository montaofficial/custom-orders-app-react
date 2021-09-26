import React, { Component } from "react";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = { page: this.props.page };
  }

  handleIngredients = (order) => {
    const elements = order.ingredients.join(", ");
    return elements;
  };

  handleConfirmButton = (order) => {
    let state = order.currentState;
    let page = this.state.page;
    let cl = "";
    if (state === "Waiting confirmation" && page === "cassa") {
      cl = "fas fa-check-circle cursor-pointer";
    }
    if (state === "" && page === "cassa") {
      cl = "fas fa-check-circle cursor-pointer";
    }
    if (state === "Deleted" && page === "cassa") {
      cl = "fas fa-check-circle cursor-pointer";
    }
    if (state === "Confirmed" && page === "cucina") {
      cl = "fas fa-bacon cursor-pointer";
    }
    if (state === "In preparation" && page === "cucina") {
      cl = "fas fa-check-circle cursor-pointer";
    }
    if (state === "Ready" && page === "cassa") {
      cl = "fas fa-check-circle cursor-pointer";
    }

    return cl;
  };

  handleDeleteButton = (order) => {
    let state = order.currentState;
    let page = this.state.page;
    let cl = "";
    if (state === "Waiting confirmation" && page === "cassa") {
      cl = "fas fa-times-circle cursor-pointer";
    }
    if (state === "Confirmed" && page === "cassa") {
      cl = "fas fa-times-circle cursor-pointer";
    }

    return cl;
  };

  handleCloseTableButton = (table) => {
    let page = this.state.page;
    if (page === "cassa") return "pappa";
    return "";
  };

  handleIcon = (type) => {
    if (type === "Burger") return "fas fa-hamburger";
    if (type === "Appetizer") return "fas fa-drumstick-bite";
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
                {this.handleCloseTableButton(table) ? (
                  <div className="col-auto">
                    <span
                      className="badge rounded-pill bg-warning text-dark cursor-pointer"
                      onClick={() => this.props.onCloseTable(table)}
                    >
                      CHIUDI TAVOLO
                    </span>
                  </div>
                ) : null}
              </div>
              {table.orders.map((order, key2) => (
                <div className="order-section-element">
                  <div className="row justify-content-between" key={key2}>
                    <div className="col-auto col-md-3  order-section-title">
                      <i className={this.handleIcon(order.type)} />
                      {order.type}
                    </div>
                    <div className="col-auto row">
                      {this.handleConfirmButton(order) ? (
                        <div className="col-auto admin-button">
                          <i
                            className={this.handleConfirmButton(order)}
                            onClick={() => this.props.onAction(order, "btn1")}
                          />
                        </div>
                      ) : null}
                      {this.handleDeleteButton(order) ? (
                        <div className="col-auto admin-button">
                          <i
                            className={this.handleDeleteButton(order)}
                            onClick={() => this.props.onAction(order, "btn2")}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col white">
                    {this.handleIngredients(order)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}{" "}
      </div>
    );
  }
}

export default Order;
