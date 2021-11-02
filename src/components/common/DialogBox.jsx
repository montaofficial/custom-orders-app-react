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
              <h4 className="yellow">Sei sicuro di voler salvare?</h4>

              <div className="white">
                Una volta salvato non sarà più possibile tornare indietro!
              </div>
              <div className="row justify-content-center mt-2">
                <div
                  className="col-auto alert-button m-1"
                  onClick={() => this.props.onSaveMenu()}
                >
                  <i className="far fa-save"></i> SALVA
                </div>
                <div
                  className="col-auto alert-button m-1"
                  onClick={() => this.props.onClose()}
                >
                  <i className="fas fa-times"></i> ANNULLA
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
