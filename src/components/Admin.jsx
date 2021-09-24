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
        {this.state.tables.map((table) => (
          <div className="menu-section">
            <div className="menu-section-element">
              Tavolo {table.number}
              {table.orders.map((order) => (
                <div className="order-section-element">
                  <inline className="order-section-title">{order.type}</inline>
                  <inline className="m-1">
                    {this.handleIngredients(order)}
                  </inline>
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
