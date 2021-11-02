import React, { Component } from "react";
import Menu from "../Menu";
import TableOrders from "../TableOrders";
const axios = require("axios");
const baseUrl = "https://orders-api.soolutions.net/api/";

class ModifyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "menu",
      options: [],
      tableOpenPopup: true,
      table: null,
      order: [],
      name: "",
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        baseUrl + `${this.props.idRistorante}/menu/${this.props.idTavolo}`
      );
      this.setState({
        options: response.data.menu,
        table: response.data.table,
      });
    } catch (error) {
      console.error(error);
    }
  }

  handlePageChange = (p) => {
    let page = p;
    this.setState({ page });
  };

  handleBurgerModify = (order) => {
    this.setState({
      order: order.ingredients,
      name: order.customer,
      page: "menu",
    });
  };

  render() {
    if (this.state.page === "table")
      return (
        <TableOrders
          admin={true}
          idRistorante={this.props.idRistorante}
          idTavolo={this.props.idTavolo}
          onPageChange={this.handlePageChange}
          tableOpen={this.state.table}
          onDone={this.props.onDone}
          onModifyBurger={this.handleBurgerModify}
        />
      );
    if (this.state.page === "menu")
      return (
        <Menu
          onResetOrder={() => {
            this.setState({ order: [], name: "" });
          }}
          order={this.state.order}
          name={this.state.name}
          admin={true}
          idRistorante={this.props.idRistorante}
          idTavolo={this.props.idTavolo}
          onPageChange={this.handlePageChange}
          options={this.state.options}
          tableOpen={this.state.table}
          tableOpenPopup={this.state.tableOpenPopup}
          onTableClosed={() =>
            this.setState({
              table: null,
              tableOpenPopup: false,
            })
          }
          onTableClosed2={() => this.setState({ tableOpenPopup: true })}
        />
      );
  }
}

export default ModifyOrders;
