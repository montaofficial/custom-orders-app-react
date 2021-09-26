import React, { Component } from "react";

class TableOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div className="fixed-top navbar-home">
          <div className="row justify-content-between">
            <div className="col-auto">
              <inline className="img">
                <img src="/logo-sham.png" alt="logo sham" />
              </inline>
              <inline className="title">
                BURGER <inline className="yellow">ORDERS</inline>
              </inline>
            </div>
            <div
              className="col-auto"
              onClick={() => this.props.onPageChange("qr")}
            >
              <div className="allign-right-title">
                <div className="menu-icon">
                  <i className="fas fa-utensils" />
                </div>
                <div className="menu-subtitle">TAVOLI</div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-container"></div>
      </div>
    );
  }
}

export default TableOverview;
