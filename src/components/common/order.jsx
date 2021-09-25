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
    if (order.inPreparation === true && this.props.page === "cassa")
      return "In preparation";
  };

  handleConfirmButton = (order) => {
    if (order.currentState === "Confirmed" && this.props.page === "cassa")
      return "fas fa-check-circle fa-disabled";
    if (order && this.props.page === "cassa") return "fas fa-check-circle";

    if (order.currentState === "Confirmed" && this.props.page === "cucina")
      return "fas fa-clock";
    if (order && this.props.page === "cucina")
      return "fas fa-clock fa-disabled";
  };

  handleDeleteButton = (order) => {
    if (order.currentState === "Deleted" && this.props.page === "cassa")
      return "fas fa-times-circle fa-disabled";
    if (order && this.props.page === "cassa") return "fas fa-times-circle";
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
              <div className="order-section-title">Tavolo {table.number}</div>
              {table.orders.map((order, key2) => (
                <div className="row order-section-element" key={key2}>
                  <div className="col-auto col-md-3 col-lg-2 order-section-title">
                    <i className={this.handleIcon(order.type)} />
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
                        this.props.onAction(
                          order,
                          table,
                          "confirm",
                          this.props.page
                        )
                      }
                    />
                  </div>
                  <div className="col-auto admin-button">
                    <i
                      className={this.handleDeleteButton(order)}
                      onClick={() =>
                        this.props.onAction(
                          order,
                          table,
                          "delete",
                          this.props.page
                        )
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
