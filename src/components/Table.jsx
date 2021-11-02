import React, { Component } from "react";
import Menu from "./Menu";
import TableOrders from "./TableOrders";
const axios = require("axios");
const baseUrl = "https://orders-api.soolutions.net/api/";

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
        baseUrl +
          `${this.props?.match?.params?.idRistorante}/menu/${this.props?.match?.params?.idTavolo}`
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
          idRistorante={this.props?.match?.params?.idRistorante}
          idTavolo={this.props?.match?.params?.idTavolo}
          onPageChange={this.handlePageChange}
          tableOpen={this.state.table}
        />
      );
    if (this.state.page === "menu")
      return (
        <Menu
          order={[]}
          name={""}
          idRistorante={this.props?.match?.params?.idRistorante}
          idTavolo={this.props?.match?.params?.idTavolo}
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
