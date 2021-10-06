import React, { Component } from "react";
import Menu from "./Menu";
import TableOrders from "./TableOrders";
const axios = require("axios");
const baseUrl = "https://custom-orders.smontanari.com/api/";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "menu",
      options: [],
      tableOpen: true,
      tableOpenPopup: true,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        baseUrl + `${this.props?.match?.params?.idRistorante}/menu`
      );
      this.setState({ options: response.data });
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
          tableOpen={this.state.tableOpen}
        />
      );
    if (this.state.page === "menu")
      return (
        <Menu
          idRistorante={this.props?.match?.params?.idRistorante}
          idTavolo={this.props?.match?.params?.idTavolo}
          onPageChange={this.handlePageChange}
          options={this.state.options}
          tableOpen={this.state.tableOpen}
          tableOpenPopup={this.state.tableOpenPopup}
          onTableClosed={() =>
            this.setState({
              tableOpen: false,
              tableOpenPopup: false,
            })
          }
          onTableClosed2={() => this.setState({ tableOpenPopup: true })}
        />
      );
  }
}

export default Table;
