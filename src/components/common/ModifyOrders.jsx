import React, { Component } from "react";
import Menu from "../Menu";
import TableOrders from "../TableOrders";
const axios = require("axios");
const baseUrl = "https://custom-orders.smontanari.com/api/";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "menu",
      options: [],
      tableOpenPopup: true,
      table: null,
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
        />
      );
    if (this.state.page === "menu")
      return (
        <Menu
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

export default Table;
