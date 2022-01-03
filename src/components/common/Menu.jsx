import React, { Component } from "react";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.menu.name,
      valid: true,
    };
  }

  render() {
    return (
      <>
        <div id="dialog_base" onClick={() => this.props.onClose()}></div>
        <div id="dialog_content">
          <div className="card alert-box">
            <div className="alert-text">
              {this.props.menu.new ? (
                <h4>NUOVO MENU</h4>
              ) : (
                <h4>MODIFICA MENU</h4>
              )}

              {this.state.valid ? null : (
                <div className="red">Inserisci un nome!</div>
              )}
              <div className="mt-4">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      className={
                        "input-group-text" +
                        (!this.state.valid && !this.state.name ? " red" : "")
                      }
                      id="inputGroup-sizing-default"
                    >
                      Nome
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control tuttoaddestra-text"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    value={this.state.name}
                    onChange={({ currentTarget: input }) =>
                      this.setState({ name: input.value })
                    }
                  />
                </div>
              </div>
              <div className="row justify-content-center mt-5">
                <div
                  className="col-auto alert-button m-1"
                  onClick={() =>
                    this.props.onSaveMenuName({
                      _id: this.props.menu._id,
                      name: this.state.name,
                      delete: false,
                    })
                  }
                >
                  <i className="far fa-save"></i> SALVA NOME
                </div>
                <div
                  className="col-auto alert-button m-1"
                  onClick={() =>
                    this.props.onEditMenu({
                      _id: this.props.menu._id,
                      name: this.state.name,
                      delete: false,
                    })
                  }
                >
                  <i className="far fa-edit"></i> MODIFICA MENU
                </div>
                <div
                  className="col-auto alert-button m-1"
                  onClick={() => this.props.onClose()}
                >
                  <i className="fas fa-long-arrow-alt-left"></i> INDIETRO
                </div>
                <div
                  className="col-auto alert-button m-1"
                  onClick={() =>
                    this.props.onDeleteMenu({
                      _id: this.props.menu._id,
                      name: this.state.name,
                      delete: true,
                    })
                  }
                >
                  <i className="fas fa-trash-alt" /> ELIMINA
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Menu;
