import React, { Component } from "react";

class DialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <div id="dialog_base" onClick={() => this.props.onClose()}></div>
        <div id="dialog_content">
          <div className="card alert-box">
            <div className="alert-text">
              <h4 className="yellow">{this.props.title}</h4>

              <div className="white">{this.props.text}</div>
              <div className="row justify-content-center mt-2">
                {this.props.admin ? (
                  <div
                    className="col-auto alert-button m-1"
                    onClick={() => this.props.onSaveMenu()}
                  >
                    <i className="far fa-save"></i> SALVA
                  </div>
                ) : null}

                <div
                  className="col-auto alert-button m-1"
                  onClick={() => this.props.onClose()}
                >
                  <i className="fas fa-times"></i> CHIUDI
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default DialogBox;
