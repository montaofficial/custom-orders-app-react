import React, { Component } from "react";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: [
        {
          number: 30,
          orders: [
            {
              type: "Burger",
              ingredients: ["carne", "foglie", "spazzatura", "sangue", "petri"],
            },
            {
              type: "Burger",
              ingredients: ["cane", "pane", "sale", "rame", "fame"],
            },
            {
              type: "Appetizer",
              ingredients: ["Nuggets"],
            },
          ],
        },
        {
          number: 13,
          orders: [
            {
              type: "Burger",
              ingredients: [
                "salamandra",
                "catrame",
                "salsa",
                "droga",
                "sigarette",
              ],
            },
            {
              type: "Burger",
              ingredients: ["scusa", "mamma", "non", "torno", "stanotte"],
            },
            {
              type: "Appetizer",
              ingredients: ["Onion rings"],
            },
          ],
        },
        {
          number: 10,
          orders: [
            {
              type: "Burger",
              ingredients: ["mangio", "da", "solo", "cazzo", "piango"],
            },
          ],
        },
      ],
    };
  }

  handleIngredients = (order) => {
    const elements = order.ingredients.join(", ");
    return elements;
  };

  render() {
    return (
      <div>
        <div className="fixed-top navbar-home">
          <inline className="img">
            <img src="/logo-sham.png" alt="logo sham" />
          </inline>
          <inline className="title">
            CUSTOM <inline className="yellow"> BURGER ORDERS</inline>
          </inline>
        </div>
        {this.state.tables.map((table) => (
          <div className="menu-section">
            <div className="menu-section-element">
              Tavolo {table.number}
              {table.orders.map((order) => (
                <div className="row order-section-element">
                  <div className="col-auto col-md-3 col-lg-2 order-section-title">
                    {order.type}
                  </div>
                  <div className="col">{this.handleIngredients(order)}</div>
                  <div className="col-auto admin-button">
                    <i className="fas fa-check-circle " />
                  </div>
                  <div className="col-auto admin-button">
                    <i className="fas fa-times-circle" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Admin;
