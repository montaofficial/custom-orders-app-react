import React, { Component } from "react";
import Order from "./common/Order";

class tableOrders extends Component {
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
                CREA IL <inline className="yellow"> TUO BURGER</inline>
              </inline>
            </div>
            <div className="col-auto">
              <div className="allign-right-title">
                <div className="menu-icon">
                  <i
                    className="fas fa-clipboard-list"
                    onClick={() => this.props.onPageChange("menu")}
                  />
                </div>
                <div className="menu-subtitle">MENU</div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-container">
          <h1 className="white">Ordini tavolo {this.props.idTavolo}</h1>
        </div>
      </div>
    );
  }
}

export default tableOrders;
