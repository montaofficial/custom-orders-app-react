import React, { Component } from "react";
import Sizes from "./Sizes";

class IngredientCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.ingredientCategory.name,
      single: this.props.ingredientCategory.single,
    };
  }
  render() {
    return (
      <>
        <div id="dialog_base" onClick={() => this.props.onClose()}></div>
        <div id="dialog_content">
          <div className="card alert-box">
            <div className="alert-text">
              {this.props.new ? (
                <h4 className="mb-4">AGGIUNGI TIPO INGREDIENTE</h4>
              ) : (
                <h4 className="mb-4">MODIFICA TIPO INGREDIENTE</h4>
              )}
              {this.props.valid ? null : (
                <div className="red mb-3">INSERICI UN NOME VALIDO</div>
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
            </div>
            <div className="row justify-content-center mt-2 vegan-toggle">
              <div className="col-auto">SCELTA SINGOLA : </div>
              <div className="col-auto">
                <i
                  className={
                    this.state.single ? "fas fa-check-square" : "fas fa-square"
                  }
                  onClick={() => this.setState({ single: !this.state.single })}
                ></i>
              </div>
              <div className="row justify-content-center mt-2">
                <div
                  className="col-auto alert-button m-1"
                  onClick={() =>
                    this.props.onSave({
                      name: this.state.name,
                      single: this.state.single,
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
                          name: this.state.name,
                          single: this.state.single,
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

export default IngredientCategory;
