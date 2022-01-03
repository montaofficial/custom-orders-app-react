import React, { Component } from "react";

class Sizes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.size._id,
      name: this.props.size.name,
      measure: this.props.size.measure,
      price: this.props.size.price,
      new: this.props.new,
      valid: this.props.valid,
      nameAlreadyUsed: this.props.nameAlreadyUsed,
    };
  }

  render() {
    return (
      <>
        <div id="dialog_base" onClick={() => this.props.onClose()}></div>
        <div id="dialog_content">
          <div className="card alert-box">
            <div className="alert-text">
              {this.state.new ? (
                <h4>AGGIUNGI DIMENSIONE</h4>
              ) : (
                <h4>MODIFICA DIMENSIONE</h4>
              )}

              {this.props.valid ? null : (
                <div className="red mb-3">NOME E PREZZO SONO OBBLIGATORI</div>
              )}
              {this.props.nameAlreadyUsed ? (
                <div className="red mb-3">NOME GIÀ UTLIZIZZATO</div>
              ) : null}
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className={
                      "input-group-text" +
                      (!this.props.valid && !this.state.name ? " red" : "")
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
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Misura
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control tuttoaddestra-text"
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  value={this.state.measure}
                  onChange={({ currentTarget: input }) =>
                    this.setState({ measure: input.value })
                  }
                />
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className={
                      "input-group-text" +
                      (!this.props.valid && !this.state.price ? " red" : "")
                    }
                    id="inputGroup-sizing-default"
                  >
                    Prezzo (€)
                  </span>
                </div>
                <input
                  type="number"
                  className="form-control tuttoaddestra-text"
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  value={this.state.price}
                  onChange={({ currentTarget: input }) =>
                    this.setState({ price: input.value })
                  }
                />
              </div>
              <div className="row justify-content-center mt-2">
                <div
                  className="col-auto alert-button m-1"
                  onClick={() =>
                    this.props.onSave({
                      _id: this.props.size._id,
                      name: this.state.name,
                      measure: this.state.measure,
                      price: this.state.price,
                    })
                  }
                >
                  <i className="far fa-save"></i> SALVA
                </div>
                <div
                  className="col-auto alert-button m-1"
                  onClick={() => this.props.onClose()}
                >
                  <i className="fas fa-times"></i> ANNULLA
                </div>
                {this.props.new ? null : (
                  <div
                    className="col-auto alert-button m-1"
                    onClick={() =>
                      this.props.onSave(
                        {
                          _id: this.props.size._id,
                          name: this.state.name,
                          measure: this.state.measure,
                          price: this.state.price,
                        },
                        true
                      )
                    }
                  >
                    <i className="fas fa-trash-alt" /> ELIMINA
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Sizes;
