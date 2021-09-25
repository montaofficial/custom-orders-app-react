import React, { Component } from "react";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleIngredients = (order) => {
    const elements = order.ingredients.join(", ");
    return elements;
  };

  handleInPreparation = (order) => {
    if (order.inPreparation === true) return "In preparation";
  };

  handleConfirmButton = (order) => {
    if (order.currentState === "Confirmed")
      return "fas fa-check-circle fa-disabled";
    if (order) return "fas fa-check-circle";
  };
  handleDeleteButton = (order) => {
    if (order.currentState === "Deleted")
      return "fas fa-times-circle fa-disabled";
    if (order) return "fas fa-times-circle";
  };

  render() {
    return (
      <div>
        {this.props.tables.map((table, key) => (
          <div className="menu-section" key={key}>
            <div className="orders-section">
              <div className="order-section-title">Tavolo {table.number}</div>
              {table.orders.map((order, key2) => (
                <div className="row order-section-element" key={key2}>
                  <div className="col-auto col-md-3 col-lg-2 order-section-title">
                    {order.type}
                  </div>
                  <div className="col">{this.handleIngredients(order)}</div>
                  <div className="col-auto">
                    {this.handleInPreparation(order)}
                  </div>
                  <div className="col-auto admin-button">
                    <i
                      className={this.handleConfirmButton(order)}
                      onClick={() =>
                        this.props.onAction(order, table, "confirm")
                      }
                    />
                  </div>
                  <div className="col-auto admin-button">
                    <i
                      className={this.handleDeleteButton(order)}
                      onClick={() =>
                        this.props.onAction(order, table, "delete")
                      }
                    />
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
