import React, { Component } from "react";
import Menu from "./Menu";
import TableOrders from "./TableOrders";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "menu",
    };
  }

  handlePageChange = (p) => {
    let page = p;
    this.setState({ page });
  };

  render() {
    if (this.state.page === "table")
      return (
        <TableOrders
          idTavolo={this.props?.match?.params?.idTavolo}
          onPageChange={this.handlePageChange}
        />
      );
    if (this.state.page === "menu")
      return (
        <Menu
          idRistorante={this.props?.match?.params?.idRistorante}
          idTavolo={this.props?.match?.params?.idTavolo}
          onPageChange={this.handlePageChange}
        />
      );
  }
}

export default Table;
