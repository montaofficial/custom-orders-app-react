import React, { Component } from "react";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.product.name,
      price: this.props.product.price,
      details: this.props.product.details,
      vegan: this.props.product.vegan,
      unavailable: this.props.product.unavailable,
    };
  }

  render() {
    return (
      <>
        <div id="dialog_base" onClick={() => this.props.onClose()}></div>
        <div id="dialog_content">
          <div className="card alert-box">
            <div className="alert-text">
              <h4>
                {this.props.new ? "AGGIUNGI PRODOTTO" : "MODIFICA PRODOTTO"}
              </h4>
              {this.props.valid ? null : (
                <div className="red">NOME E PREZZO SONO OBBLIGATORI</div>
              )}
              <div className="mt-4">
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
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-default"
                    >
                      Descrizione
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control tuttoaddestra-text"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    value={this.state.details}
                    onChange={({ currentTarget: input }) =>
                      this.setState({ details: input.value })
                    }
                  />
                </div>
              </div>
              <div className="row justify-content-center mt-2 vegan-toggle">
                <div className="col-auto">
                  VEGAN{" "}
                  <span className="element-vegan">
                    <i className="fas fa-leaf"></i>
                  </span>
                  :{" "}
                </div>
                <div className="col-auto">
                  <i
                    className={
                      this.state.vegan ? "fas fa-check-square" : "fas fa-square"
                    }
                    onClick={() => this.setState({ vegan: !this.state.vegan })}
                  ></i>
                </div>
                <div className="col-auto">NON DISPONIBILE: </div>
                <div className="col-auto">
                  <i
                    className={
                      this.state.unavailable
                        ? "fas fa-check-square"
                        : "fas fa-square"
                    }
                    onClick={() =>
                      this.setState({ unavailable: !this.state.unavailable })
                    }
                  ></i>
                </div>
              </div>
              <div className="row justify-content-center mt-2">
                <div
                  className="col-auto alert-button m-1"
                  onClick={() =>
                    this.props.onMod({
                      _id: this.props.product._id,
                      name: this.state.name,
                      price: this.state.price,
                      details: this.state.details,
                      vegan: this.state.vegan,
                      unavailable: this.state.unavailable,
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
                <div
                  className="col-auto alert-button m-1"
                  onClick={() =>
                    this.props.onMod(
                      {
                        _id: this.props.product._id,
                        name: this.state.name,
                        price: this.state.price,
                        details: this.state.details,
                        vegan: this.state.vegan,
                        unavailable: this.state.unavailable,
                      },
                      true
                    )
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

export default Product;
