import React, { Component } from "react";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="fixed-top navbar-home">
        <div className="row justify-content-between">
          <div className="col-auto">
            <span className="img">
              <img src="/logo-sham-low.svg" alt="logo" />
            </span>
            <span className="title">
              {this.props.whiteTitle}{" "}
              <span className="yellow"> {this.props.yellowTitle}</span>
            </span>
          </div>
          <div className="col-auto allign-right-title">
            <div className="row">
              {this.props.btn2Text ? (
                <div
                  className="col-auto tuttoaddestra"
                  onClick={() => this.props.onButton2()}
                >
                  <div className="menu-icon">
                    <i className={this.props.icon2} />
                  </div>
                  <div className="menu-subtitle">{this.props.btn2Text}</div>
                </div>
              ) : null}
              {this.props.btn1Text ? (
                <div
                  className="col-auto"
                  onClick={() => this.props.onButton1()}
                >
                  <div className="menu-icon">
                    <i className={this.props.icon1} />
                  </div>
                  <div className="menu-subtitle">{this.props.btn1Text}</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
