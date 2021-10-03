import React, { Component } from "react";
import _ from "lodash";
import axios from "axios";
const baseUrl = "https://custom-orders.smontanari.com/api/";

class Cucina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "cucina",
      options: [],
      tables: [],
      waitingConfirmation: [],
      confirmed: [],
      inPreparation: [],
      waiterRequests: [],
      billRequests: [],
      allIngredients: [],
    };
  }

  tempConfirmed = [];
  tempWaitingConfirmation = [];
  isFirstTime = true;

  checkIfMounted() {
    return this.mounted;
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        baseUrl + `614d9fb7db2d0588b88a006b/menu`
      );
      this.setState({ options: response.data });
    } catch (error) {
      console.error(error);
    }

    this.mounted = true;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(
      "wss://custom-orders.smontanari.com/api/orders/" +
        this.props?.match?.params?.idRistorante
    );
    this.ws.onopen = () => {
      console.log("wss connected!");
    };

    this.ws.onmessage = (e) => {
      let body = {};
      try {
        body = JSON.parse(e.data);
        //console.log(body);
      } catch (e) {
        console.log(e.message);
      }

      if (!body) return console.log("Empty JSON!!!");

      if (body.shape == "custom-orders.v1.orders") {
        //console.log("Updated!");

        let tableObject = {};
        let tables = [];

        for (let order of body.orders) {
          if (!tableObject[order.table])
            tableObject[order.table] = {
              number: order.tableName,
              id: order.table,
              orders: [],
            };

          tableObject[order.table].orders.push(order);
        }

        for (let tableId in tableObject) {
          tables.push(tableObject[tableId]);
        }

        //Detecting changes in orders
        let waitingConfirmationNow = [];
        let confirmedNow = [];
        let inPreparation = [];
        for (let order of body.orders) {
          if (order.currentState === "In preparation") {
            inPreparation.push(order);
          }
        }
        // passo gli array cambiati qui dentro
        this.playAudio({ confirmedNow, waitingConfirmationNow });

        let allIngredients = [];
        let mrFail = 0;
        for (let i = 0; i < inPreparation.length; i++) {
          for (let c = 0; c < inPreparation[i].ingredients.length; c++) {
            if (inPreparation[i].type === "Burger") {
              for (let d = 0; d < allIngredients.length; d++) {
                if (
                  allIngredients[d].ingredient ===
                  inPreparation[i].ingredients[c]
                ) {
                  allIngredients[d].count++;
                } else {
                  mrFail++;
                }
              }
              if (mrFail === allIngredients.length) {
                allIngredients.push({
                  ingredient: inPreparation[i].ingredients[c],
                  count: 1,
                });
              }
              mrFail = 0;
            }
          }
        }

        this.setState({
          tables,
          inPreparation,
          allIngredients,
        });
      }

      if (body.shape == "custom-orders.v1.calls") {
        console.log("Updated calls!");

        let calls = body.calls.filter((c) => c.currentState === "waiting");
        const newWaiterRequest = calls.filter((c) => c.type === "waiter");
        const newBillRequest = calls.filter((c) => c.type === "bill");

        if (this.state.waiterRequests.length < newWaiterRequest.length) {
          this.playAudioRaw();
        }
        if (this.state.billRequests.length < newBillRequest.length) {
          this.playAudioRaw();
        }

        return this.setState({
          waiterRequests: newWaiterRequest,
          billRequests: newBillRequest,
        });
      }
    };

    this.ws.onclose = (e) => {
      console.log(
        "Socket is closed. Reconnect will be attempted in 1 second.",
        e.reason
      );
      if (!this.checkIfMounted()) return this.componentWillUnmount();
      setTimeout(() => {
        this.connect();
      }, 1000);
    };

    this.ws.onerror = (err) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
    };
  }

  componentWillUnmount() {
    this.mounted = false;
    this.ws.onclose = (e) => {
      console.log("Socket is safely closed.", e.reason);
    };
    this.ws.close();

    if (this.interval) clearInterval(this.interval);
  }

  playAudio(data) {
    if (this.isFirstTime) {
      this.isFirstTime = false;
      this.tempWaitingConfirmation = data.waitingConfirmationNow;
      this.tempConfirmed = data.confirmedNow;
      return;
    }
    if (this.state.page == "cassa") {
      const newOrders = this.tempWaitingConfirmation;
      const oldOrders = data.waitingConfirmationNow;
      if (
        !_.isEqual(_.sortBy(oldOrders), _.sortBy(newOrders)) &&
        oldOrders.length >= newOrders.length
      ) {
        console.log("Nuova comanda in cassa, suono!");
        try {
          const audioEl = document.getElementById("audio-element");
          audioEl.play();
          this.tempWaitingConfirmation = oldOrders;
        } catch (e) {
          console.log(e.message);
        }
      }
    }

    if (this.state.page == "cucina") {
      const newOrders = this.tempConfirmed;
      const oldOrders = data.confirmedNow;
      if (
        !_.isEqual(_.sortBy(oldOrders), _.sortBy(newOrders)) &&
        oldOrders.length >= newOrders.length
      ) {
        console.log("Nuova comanda in cucina, suono!");
        try {
          const audioEl = document.getElementById("audio-element");
          audioEl.play();
          this.tempConfirmed = oldOrders;
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  }

  playAudioRaw() {
    try {
      const audioEl = document.getElementById("audio-element");
      audioEl.play();
    } catch (e) {
      console.log(e.message);
    }
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

  handleIcon = (type) => {
    if (type === "Burger") return "fas fa-hamburger";
    if (type === "Appetizer") return "fas fa-drumstick-bite";
    if (type === "Crostone") return "fas fa-bread-slice";
  };

  handleButtons = async (order) => {
    let state = ""; // "Waiting confirmation", "Confirmed", "In preparation", "Ready", "Deleted"
    if (order.currentState == "Confirmed") state = "In preparation";
    if (order.currentState == "In preparation") state = "Ready";
    if (order.currentState == "Ready") state = "In preparation";

    try {
      const response = await axios.post(baseUrl + `orders/${order._id}`, {
        currentState: state,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
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

  handleClassColor = (order) => {
    let newClass = "order-section-element ";
    if (order.currentState === "In preparation")
      return newClass + "inPreparation";
    if (order.currentState === "Ready") return newClass + "ready";
    return newClass;
  };

  render() {
    return (
      <div className="admin-container-cucina">
        <div className="table-container-cucina">Ingredienti necessari:</div>
        <div className="white">
          {() =>
            this.handleTypeFiltration(
              this.handleInPreparationOrdersIngredients(
                this.state.inPreparation
              ),
              "Carne"
            )
          }
          <div className="row">
            {this.state.options.slice(0, 4).map((category, key) => (
              <div className="col" key={key}>
                <div className="table-container-cucina">
                  <div className="allign-left-title-cucina">
                    {category.name}
                  </div>
                  <div className="white">
                    {category.options.map((element, key2) => (
                      <div>
                        {this.state.allIngredients
                          .map((a) => a.ingredient)
                          .includes(element.name) ? (
                          <div>
                            {this.state.allIngredients.map((a) => {
                              if (a.ingredient === element.name) {
                                return a.count;
                              }
                            })}{" "}
                            {element.name}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="row justify-content-start">
          {this.state.tables.map((table, key) => {
            const orders = table.orders.filter((o) =>
              ["Confirmed", "In preparation", "Ready"].includes(o.currentState)
            );
            if (!orders?.length) return null;
            return (
              <div
                key={key}
                className="col-12 col-md-4 col-lg-3 col-xxl-2 mt-2"
              >
                <div className="table-container-cucina">
                  <div className="allign-left-title-cucina">
                    Tavolo {table.number}
                  </div>
                  <div>
                    {orders.map((order, key2) => (
                      <div key={key2}>
                        <div
                          className={this.handleClassColor(order)}
                          onClick={() => this.handleButtons(order)}
                        >
                          <div className="allign-left-subtitle-cucina">
                            <i className={this.handleIcon(order.type)}></i>
                            {this.handleOrderType(order).type}
                          </div>
                          <div className="allign-left-text-cucina">
                            {this.handleIngredients(order)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Cucina;
