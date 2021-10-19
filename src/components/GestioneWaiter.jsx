import React, { Component } from "react";
import ModifyOrders from "./common/ModifyOrders";
import TableOverview from "./TableOverview";
import MrQR from "./MrQR";

import _ from "lodash";
import axios from "axios";
const baseUrl = "https://custom-orders.smontanari.com/api/";

class Cucina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "cassa",
      options: [],
      tables: [],
      tablesWithState: [],
      waitingConfirmation: [],
      confirmed: [],
      inPreparation: [],
      waiterRequests: [],
      billRequests: [],
      allIngredients: [],
      modify: null,
      expanded: [],
      waitingBlink: false,
      inPreparationBefore: [],
      change: false,
    };
  }

  tempConfirmed = [];
  tempWaitingConfirmation = [];
  isFirstTime = true;

  checkIfMounted() {
    return this.mounted;
  }

  getHeaders() {
    const token = localStorage.getItem("custom-orders-token") || "";
    return {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        baseUrl + `${this.props?.match?.params?.idRistorante}/menu`,
        this.getHeaders()
      );
      this.setState({ options: response.data });
    } catch (error) {
      console.error(error);
    }
    this.timer = setInterval(() => {
      this.setState({ waitingBlink: !this.state.waitingBlink });
    }, 1000);

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

        let confirmedNow = [];
        let waitingConfirmationNow = [];
        let inPreparation = [];
        for (let order of body.orders) {
          if (order.currentState === "In preparation") {
            inPreparation.push(order);
          }
        }
        // passo gli array cambiati qui dentro
        this.playAudio({ confirmedNow, waitingConfirmationNow });

        let change = false;
        //Detecting changes in orders
        if (this.state.inPreparationBefore !== inPreparation) {
          change = true;
        }

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

        let tablesWithState = [];

        if (change) {
          for (let i = 0; i < tables.length; i++) {
            tablesWithState.push({
              table: tables[i],
              state: this.handleTableState(tables[i].orders),
            });
          }
        }

        this.setState({
          tablesWithState,
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
    if (this.timer) clearInterval(this.timer);
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
        console.log("Nuova comanda, suono!");
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
    if (order.currentState == "Waiting confirmation") state = "Confirmed";
    if (order.currentState == "Ready") state = "Done";
    if (order.currentState == "Confirmed") state = "Waiting confirmation";

    try {
      const response = await axios.post(
        baseUrl + `orders/${order._id}`,
        {
          currentState: state,
        },
        this.getHeaders()
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  handleAllOrders = async (action, orders) => {
    if (action === "confirm") {
      const toConfirm = orders.filter(
        (o) => o.currentState === "Waiting confirmation"
      );
      for (let i = 0; i < toConfirm.length; i++) {
        try {
          const response = await axios.post(
            baseUrl + `orders/${toConfirm[i]._id}`,
            {
              currentState: "Confirmed",
            },
            this.getHeaders()
          );
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      }
    }
    if (action === "deliver") {
      const toConfirm = orders.filter((o) => o.currentState === "Ready");
      for (let i = 0; i < toConfirm.length; i++) {
        try {
          const response = await axios.post(
            baseUrl + `orders/${toConfirm[i]._id}`,
            {
              currentState: "Done",
            },
            this.getHeaders()
          );
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      }
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
    if (order.currentState === "Confirmed") return newClass + "confirmed";
    return newClass;
  };

  handleTableState = (orders) => {
    //"Waiting confirmation", "Confirmed", "In preparation", "Ready", "Deleted"
    let state = "";
    let confirmed = 0;
    let inPreparation = 0;
    let ready = 0;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].currentState === "Waiting confirmation") {
        return "IN ATTESA DI CONFERMA";
      }
      if (orders[i].currentState === "Confirmed") {
        confirmed++;
      }

      if (orders[i].currentState === "In preparation") inPreparation++;

      if (orders[i].currentState === "Ready") ready++;
    }

    if (confirmed + inPreparation + inPreparation + ready === 0)
      return "INATTIVO";

    let filteredOrders = orders.filter(
      (o) =>
        o.currentState !== "Deleted" &&
        o.currentState !== "Done" &&
        o.currentState !== "Deleted by Customer"
    );

    if (confirmed === filteredOrders.length) {
      return "ORDINE CONFERMATO";
    }
    if (inPreparation + confirmed === filteredOrders.length) {
      return "ORDINE IN PREPARAZIONE";
    }
    if (ready === filteredOrders.length) {
      return "ORDINE PRONTO";
    }

    return "PARZIALMENTE PRONTO";
  };

  handlePageChange = (page) => {
    this.setState({ page });
  };

  handleModifyOrders = (id) => {
    this.setState({ modify: id, page: "cassa" });
  };

  handleExpanded = (table) => {
    let expanded = this.state.expanded;
    if (expanded.includes(table.id)) {
      expanded = expanded.filter((id) => id !== table.id);
    } else {
      expanded.push(table.id);
    }
    this.setState({ expanded });
  };

  async handleWaiterCall(type) {
    try {
      const response = await axios.post(
        baseUrl + `calls/${type._id}`,
        {
          currentState: "served",
        },
        this.getHeaders()
      );
    } catch (e) {
      console.log(e.message);
    }
  }

  handleOrderBlink = (state) => {
    if (state === "IN ATTESA DI CONFERMA") {
      if (this.state.waitingBlink) {
        return "table-container-waiter-waiting rounded";
      } else {
        return "table-container-waiter-waiting rounded order-blink-waiting rounded";
      }
    }
    if (state === "ORDINE PRONTO") {
      if (this.state.waitingBlink) {
        return "table-container-waiter-ready rounded";
      } else {
        return "table-container-waiter-ready rounded order-blink-ready";
      }
    }
    return "table-container-waiter-neutral rounded";
  };

  render() {
    // console.log("render");
    return (
      <>
        {this.state.page === "tavoli" ? (
          <TableOverview
            idRistorante={this.props?.match?.params?.idRistorante}
            onPageChange={this.handlePageChange}
            tables={this.state.tables}
            admin={true}
            onModifyOrders={this.handleModifyOrders}
          />
        ) : null}
        {this.state.page === "qr" ? (
          <MrQR
            onPageChange={this.handlePageChange}
            idRistorante={this.props?.match?.params?.idRistorante}
            admin={true}
            onModifyOrders={this.handleModifyOrders}
          />
        ) : null}
        {this.state.page === "cassa" ? (
          <>
            {this.state.modify ? (
              <ModifyOrders
                idRistorante={this.props?.match?.params?.idRistorante}
                idTavolo={this.state.modify}
                onDone={() => this.setState({ modify: null })}
              />
            ) : (
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
                    <div
                      className="col-auto"
                      onClick={() => this.setState({ page: "tavoli" })}
                    >
                      <div className="allign-right-title cursor-pointer">
                        <div className="menu-icon">
                          <i className="fas fa-user-alt  cursor-pointer" />
                        </div>
                        <div className="menu-subtitle">CAMERIERE</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="admin-container">
                  <div className="menu-section min-h-200 rounded">
                    <h4>Richieste servizio</h4>
                    <div className="row justify-content-start">
                      {this.state.waiterRequests.map((request, key) => (
                        <div
                          className="col-3 col-md-2 col-xl-1 alert-button button-small "
                          onClick={() => {
                            this.handleWaiterCall(request);
                          }}
                          key={key}
                        >
                          <i className="fas fa-user-tie"></i>{" "}
                          {request.tableName}
                        </div>
                      ))}
                    </div>
                    <div className="row justify-content-start">
                      {this.state.billRequests.map((request, key) => (
                        <div
                          className="col-3 col-md-2 col-xl-1 alert-button-bill button-small "
                          onClick={() => {
                            this.handleWaiterCall(request);
                          }}
                          key={key}
                        >
                          <i className="fas fa-file-invoice-dollar"></i>{" "}
                          {request.tableName}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="row justify-content-start">
                    {this.state.tablesWithState
                      .filter((t) => t.state === "ORDINE PRONTO")
                      .map((table, key) => {
                        const orders = table.table.orders.filter((o) =>
                          [
                            "Waiting confirmation",
                            "Confirmed",
                            "In preparation",
                            "Ready",
                          ].includes(o.currentState)
                        );
                        if (!orders?.length) return null;
                        return (
                          <div
                            key={key}
                            className="col-12 col-md-4 col-lg-3 col-xxl-2 mt-2"
                          >
                            <div className={this.handleOrderBlink(table.state)}>
                            <div className="min-h-table-waiter px-2 py-1" onClick={() =>
                                    this.handleExpanded(table.table)
                                  }>
                                <div className="row justify-content-between">
                                  <div className="col-auto allign-left-title-cucina">
                                    Tavolo {table.table.number}
                                  </div>
                                  <div className="col-auto yellow-g">
                                    {table.state}
                                  </div>
                                </div>
                              </div>
                              {this.state.expanded.includes(table.table.id) ? (
                                <div className="px-2">
                                  <div>
                                    {orders
                                      .filter((o) => o.type === "Burger")
                                      .map((order, key2) => (
                                        <div key={key2}>
                                          <div
                                            className={this.handleClassColor(
                                              order
                                            )}
                                            onClick={() =>
                                              this.handleButtons(order)
                                            }
                                          >
                                            <div className="row">
                                              <div className="col-auto allign-left-text-cucina">
                                                {order.customer} ha ordinato:
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-auto allign-left-subtitle-cucina">
                                                <i
                                                  className={this.handleIcon(
                                                    order.type
                                                  )}
                                                ></i>
                                                {
                                                  this.handleOrderType(order)
                                                    .type
                                                }
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col">
                                                {order.ingredients
                                                  .slice(
                                                    0,
                                                    Math.ceil(
                                                      order.ingredients.length /
                                                        2
                                                    )
                                                  )
                                                  .map((i, key3) => (
                                                    <div
                                                      className="row"
                                                      key={key3}
                                                    >
                                                      <div className="col-auto allign-left-text-cucina">
                                                        ◆
                                                      </div>
                                                      <div className="col allign-left-text-cucina">
                                                        {" "}
                                                        {i}
                                                      </div>
                                                    </div>
                                                  ))}
                                              </div>
                                              <div className="col">
                                                {order.ingredients
                                                  .slice(
                                                    Math.ceil(
                                                      order.ingredients.length /
                                                        2
                                                    )
                                                  )
                                                  .map((i, key3) => (
                                                    <div
                                                      className="row"
                                                      key={key3}
                                                    >
                                                      <div className="col-auto allign-left-text-cucina">
                                                        ◆
                                                      </div>
                                                      <div className="col allign-left-text-cucina">
                                                        {" "}
                                                        {i}
                                                      </div>
                                                    </div>
                                                  ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    {orders
                                      .filter((o) => o.type !== "Burger")
                                      .map((order, key2) => (
                                        <div key={key2}>
                                          <div
                                            className={this.handleClassColor(
                                              order
                                            )}
                                            onClick={() =>
                                              this.handleButtons(order)
                                            }
                                          >
                                            <div className="row">
                                              <div className="allign-left-text-cucina">
                                                {order.customer} ha ordinato:
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="allign-left-subtitle-cucina">
                                                <i
                                                  className={this.handleIcon(
                                                    this.handleOrderType(order)
                                                      .type
                                                  )}
                                                ></i>
                                                {
                                                  this.handleOrderType(order)
                                                    .type
                                                }
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-auto allign-left-text-cucina">
                                                ◆{this.handleIngredients(order)}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                  <div className="row justify-content-center ">
                                    <div
                                      className="col-auto alert-button-waiter m-1"
                                      onClick={() =>
                                        this.handleAllOrders("confirm", orders)
                                      }
                                    >
                                      <i className="far fa-calendar-check"></i>{" "}
                                      CONFERMA TUTTO
                                    </div>
                                    <div
                                      className="col-auto alert-button-waiter m-1"
                                      onClick={() =>
                                        this.handleAllOrders("deliver", orders)
                                      }
                                    >
                                      <i className="far fa-paper-plane"></i>{" "}
                                      CONSEGNA TUTTO
                                    </div>
                                    <div
                                      onClick={() => {
                                        this.setState({
                                          modify: table.table.id,
                                        });
                                      }}
                                      className="col-auto alert-button-waiter m-1"
                                    >
                                      <i className="fas fa-edit"></i> MODIFICA
                                      ORDINI
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    {this.state.tablesWithState
                      .filter((t) => t.state === "IN ATTESA DI CONFERMA")
                      .map((table, key) => {
                        const orders = table.table.orders.filter((o) =>
                          [
                            "Waiting confirmation",
                            "Confirmed",
                            "In preparation",
                            "Ready",
                          ].includes(o.currentState)
                        );
                        if (!orders?.length) return null;
                        return (
                          <div
                            key={key}
                            className="col-12 col-md-4 col-lg-3 col-xxl-2 mt-2"
                          >
                            <div className={this.handleOrderBlink(table.state)}>
                              <div className="min-h-table-waiter px-2 py-1" onClick={() =>
                                    this.handleExpanded(table.table)
                                  }>
                                <div className="row justify-content-between">
                                  <div className="col-auto allign-left-title-cucina">
                                    Tavolo {table.table.number}
                                  </div>
                                  <div className="col-auto yellow-g">
                                    {table.state}
                                  </div>
                                </div>
                              </div>
                              {this.state.expanded.includes(table.table.id) ? (
                                <div className="px-2">
                                  <div>
                                    {orders
                                      .filter((o) => o.type === "Burger")
                                      .map((order, key2) => (
                                        <div key={key2}>
                                          <div
                                            className={this.handleClassColor(
                                              order
                                            )}
                                            onClick={() =>
                                              this.handleButtons(order)
                                            }
                                          >
                                            <div className="row">
                                              <div className="col-auto allign-left-text-cucina">
                                                {order.customer} ha ordinato:
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-auto allign-left-subtitle-cucina">
                                                <i
                                                  className={this.handleIcon(
                                                    order.type
                                                  )}
                                                ></i>
                                                {
                                                  this.handleOrderType(order)
                                                    .type
                                                }
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col">
                                                {order.ingredients
                                                  .slice(
                                                    0,
                                                    Math.ceil(
                                                      order.ingredients.length /
                                                        2
                                                    )
                                                  )
                                                  .map((i, key3) => (
                                                    <div
                                                      className="row"
                                                      key={key3}
                                                    >
                                                      <div className="col-auto allign-left-text-cucina">
                                                        ◆
                                                      </div>
                                                      <div className="col allign-left-text-cucina">
                                                        {" "}
                                                        {i}
                                                      </div>
                                                    </div>
                                                  ))}
                                              </div>
                                              <div className="col">
                                                {order.ingredients
                                                  .slice(
                                                    Math.ceil(
                                                      order.ingredients.length /
                                                        2
                                                    )
                                                  )
                                                  .map((i, key3) => (
                                                    <div
                                                      className="row"
                                                      key={key3}
                                                    >
                                                      <div className="col-auto allign-left-text-cucina">
                                                        ◆
                                                      </div>
                                                      <div className="col allign-left-text-cucina">
                                                        {" "}
                                                        {i}
                                                      </div>
                                                    </div>
                                                  ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    {orders
                                      .filter((o) => o.type !== "Burger")
                                      .map((order, key2) => (
                                        <div key={key2}>
                                          <div
                                            className={this.handleClassColor(
                                              order
                                            )}
                                            onClick={() =>
                                              this.handleButtons(order)
                                            }
                                          >
                                            <div className="row">
                                              <div className="allign-left-text-cucina">
                                                {order.customer} ha ordinato:
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="allign-left-subtitle-cucina">
                                                <i
                                                  className={this.handleIcon(
                                                    this.handleOrderType(order)
                                                      .type
                                                  )}
                                                ></i>
                                                {
                                                  this.handleOrderType(order)
                                                    .type
                                                }
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-auto allign-left-text-cucina">
                                                ◆{this.handleIngredients(order)}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                  <div className="row justify-content-center ">
                                    <div
                                      className="col-auto alert-button-waiter m-1"
                                      onClick={() =>
                                        this.handleAllOrders("confirm", orders)
                                      }
                                    >
                                      <i className="far fa-calendar-check"></i>{" "}
                                      CONFERMA TUTTO
                                    </div>
                                    <div
                                      className="col-auto alert-button-waiter m-1"
                                      onClick={() =>
                                        this.handleAllOrders("deliver", orders)
                                      }
                                    >
                                      <i className="far fa-paper-plane"></i>{" "}
                                      CONSEGNA TUTTO
                                    </div>
                                    <div
                                      onClick={() => {
                                        this.setState({
                                          modify: table.table.id,
                                        });
                                      }}
                                      className="col-auto alert-button-waiter m-1"
                                    >
                                      <i className="fas fa-edit"></i> MODIFICA
                                      ORDINI
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    {this.state.tablesWithState
                      .filter(
                        (t) =>
                          t.state !== "IN ATTESA DI CONFERMA" &&
                          t.state !== "ORDINE PRONTO"
                      )
                      .map((table, key) => {
                        const orders = table.table.orders.filter((o) =>
                          [
                            "Waiting confirmation",
                            "Confirmed",
                            "In preparation",
                            "Ready",
                          ].includes(o.currentState)
                        );
                        if (!orders?.length) return null;
                        return (
                          <div
                            key={key}
                            className="col-12 col-md-4 col-lg-3 col-xxl-2 mt-2"
                          >
                            <div className={this.handleOrderBlink(table.state)}>
                              <div className="min-h-table-waiter px-2 py-1" onClick={() =>
                                    this.handleExpanded(table.table)
                                  }>
                                <div className="row justify-content-between">
                                  <div className="col-auto allign-left-title-cucina">
                                    Tavolo {table.table.number}
                                  </div>
                                  <div className="col-auto yellow-g">
                                    {table.state}
                                  </div>
                                </div>
                              </div>
                              {this.state.expanded.includes(table.table.id) ? (
                                <div className="px-2">
                                  <div>
                                    {orders
                                      .filter((o) => o.type === "Burger")
                                      .map((order, key2) => (
                                        <div key={key2}>
                                          <div
                                            className={this.handleClassColor(
                                              order
                                            )}
                                            onClick={() =>
                                              this.handleButtons(order)
                                            }
                                          >
                                            <div className="row">
                                              <div className="col-auto allign-left-text-cucina">
                                                {order.customer} ha ordinato:
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-auto allign-left-subtitle-cucina">
                                                <i
                                                  className={this.handleIcon(
                                                    order.type
                                                  )}
                                                ></i>
                                                {
                                                  this.handleOrderType(order)
                                                    .type
                                                }
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col">
                                                {order.ingredients
                                                  .slice(
                                                    0,
                                                    Math.ceil(
                                                      order.ingredients.length /
                                                        2
                                                    )
                                                  )
                                                  .map((i, key3) => (
                                                    <div
                                                      className="row"
                                                      key={key3}
                                                    >
                                                      <div className="col-auto allign-left-text-cucina">
                                                        ◆
                                                      </div>
                                                      <div className="col allign-left-text-cucina">
                                                        {" "}
                                                        {i}
                                                      </div>
                                                    </div>
                                                  ))}
                                              </div>
                                              <div className="col">
                                                {order.ingredients
                                                  .slice(
                                                    Math.ceil(
                                                      order.ingredients.length /
                                                        2
                                                    )
                                                  )
                                                  .map((i, key3) => (
                                                    <div
                                                      className="row"
                                                      key={key3}
                                                    >
                                                      <div className="col-auto allign-left-text-cucina">
                                                        ◆
                                                      </div>
                                                      <div className="col allign-left-text-cucina">
                                                        {" "}
                                                        {i}
                                                      </div>
                                                    </div>
                                                  ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    {orders
                                      .filter((o) => o.type !== "Burger")
                                      .map((order, key2) => (
                                        <div key={key2}>
                                          <div
                                            className={this.handleClassColor(
                                              order
                                            )}
                                            onClick={() =>
                                              this.handleButtons(order)
                                            }
                                          >
                                            <div className="row">
                                              <div className="allign-left-text-cucina">
                                                {order.customer} ha ordinato:
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="allign-left-subtitle-cucina">
                                                <i
                                                  className={this.handleIcon(
                                                    this.handleOrderType(order)
                                                      .type
                                                  )}
                                                ></i>
                                                {
                                                  this.handleOrderType(order)
                                                    .type
                                                }
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-auto allign-left-text-cucina">
                                                ◆{this.handleIngredients(order)}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                  <div className="row justify-content-center ">
                                    <div
                                      className="col-auto alert-button-waiter m-1"
                                      onClick={() =>
                                        this.handleAllOrders("confirm", orders)
                                      }
                                    >
                                      <i className="far fa-calendar-check"></i>{" "}
                                      CONFERMA TUTTO
                                    </div>
                                    <div
                                      className="col-auto alert-button-waiter m-1"
                                      onClick={() =>
                                        this.handleAllOrders("deliver", orders)
                                      }
                                    >
                                      <i className="far fa-paper-plane"></i>{" "}
                                      CONSEGNA TUTTO
                                    </div>
                                    <div
                                      onClick={() => {
                                        this.setState({
                                          modify: table.table.id,
                                        });
                                      }}
                                      className="col-auto alert-button-waiter m-1"
                                    >
                                      <i className="fas fa-edit"></i> MODIFICA
                                      ORDINI
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}
          </>
        ) : null}
      </>
    );
  }
}

export default Cucina;
