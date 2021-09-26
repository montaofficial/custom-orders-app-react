import React, { Component } from "react";

class MrQR extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div>
          <div className="fixed-top navbar-home">
            <div className="row">
              <div className="col-auto">
                <inline className="img">
                  <img src="/logo-sham.png" alt="logo sham" />
                </inline>
                <inline className="title">
                  CUSTOM <inline className="yellow"> BURGER ORDERS</inline>
                </inline>
              </div>
              <div className="col">
                <div
                  className="allign-right-title"
                  onClick={() => this.props.onPageChange("cassa")}
                >
                  <i className="fas fa-qrcode m-2" />
                  QR CODE
                </div>
              </div>
            </div>
          </div>

          <div className="admin-container">
            <h1 className="white">Crea nuovo tavolo</h1>

            <img className="img-fluid rounded" src={genQrLink("https://google.com/")} alt="qr link" />
          </div>
        </div>
      </div>
    );
  }
}

function genQrLink (link) {
  return `https://image-charts.com/chart?chs=900x900&cht=qr&choe=UTF-8&chl=${encodeURIComponent(link)}`
}

export default MrQR;
