import { size } from "lodash";
import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Sizes from "./Sizes";

// Riordina i risultati
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class Ingredient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.ingredient.name,
      price: this.props.ingredient.price,
      sizes: this.props.ingredient.sizes,
      details: this.props.ingredient.details,
      vegan: this.props.ingredient.vegan,
      unavailable: this.props.ingredient.unavailable,
      editSizes: null,
      new: false,
      valid: true,
      nameAlreadyUsed: false,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sizes = reorder(
      this.state.sizes,
      result.source.index,
      result.destination.index
    );

    this.setState({
      sizes,
    });
  }

  saveSize = (modS, del) => {
    console.log(modS);

    let sizes = this.state.sizes;

    //If sizes is empty replacing sizes with an empty array
    if (sizes === undefined) {
      sizes = [];
    }

    //Deleting
    if (del) {
      //Searcing for the index of the option
      const sizeIndex = sizes.findIndex((s) => s.name === modS.name);

      //if delete command deleting the option
      if (del) {
        if (sizeIndex > -1) {
          sizes.splice(sizeIndex, 1);
        }
      }
    }

    //Updating or adding a new size
    else {
      //Validating name and price

      if (modS.name === "" || modS.price === "") {
        this.setState({ valid: false });
        return;
      } else {
        this.setState({ valid: true });
      }

      //Checking if name already been used

      const nameAlreadyUsed = sizes.filter((s) => s.name === modS.name);

      if (
        nameAlreadyUsed.length !== 0 &&
        this.state.editSizes.name !== modS.name
      ) {
        //Name already been used
        this.setState({ nameAlreadyUsed: true });
        return;
      } else {
        //Name is valid
        this.setState({ nameAlreadyUsed: false });
      }

      if (this.state.new) {
        //Creating a new size
        sizes.push(modS);
      }
      //Updating a size
      else {
        const sizeIndex = sizes.findIndex(
          (s) => s.name === this.state.editSizes.name
        );

        sizes[sizeIndex] = modS;
      }
    }

    this.setState({
      sizes,
      price: null,
      editSizes: null,
      valid: true,
      new: false,
      nameAlreadyUsed: false,
    });
  };

  validate = () => {
    //Checking if the product has size
    console.log("Mi hanno chiesto di validare: ", this.state.sizes);
  };

  render() {
    return (
      <>
        {this.state.editSizes ? (
          <Sizes
            size={this.state.editSizes}
            onClose={() => {
              this.setState({
                editSizes: null,
                valid: true,
                new: false,
                nameAlreadyUsed: false,
              });
            }}
            onSave={(s, del) => this.saveSize(s, del)}
            new={this.state.new}
            valid={this.state.valid}
            nameAlreadyUsed={this.state.nameAlreadyUsed}
          />
        ) : (
          <>
            <div id="dialog_base" onClick={() => this.props.onClose()}></div>
            <div id="dialog_content">
              <div className="card alert-box">
                <div className="alert-text">
                  <h4>
                    {this.props.new ? (
                      <>
                        {!this.props.uneditable
                          ? "AGGIUNGI INGREDIENTE"
                          : "AGGIUNGI PRODOTTO"}
                      </>
                    ) : (
                      <>
                        {!this.props.uneditable
                          ? "MODIFICA INGREDIENTE"
                          : "MODIFICA PRODOTTO"}
                      </>
                    )}
                  </h4>
                  {this.props.valid ? null : (
                    <div className="red">NOME E PREZZO SONO OBBLIGATORI</div>
                  )}
                  {this.props.nameAlreadyUsed ? (
                    <div className="red">NOME GIÀ UTLIZIZZATO</div>
                  ) : null}
                  <div className="mt-4">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span
                          className={
                            "input-group-text" +
                            (!this.props.valid && !this.state.name
                              ? " red"
                              : "")
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
                    {this.state.sizes?.length ? (
                      <div className="row justify-content-center">
                        <div className="col-11">
                          <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId="droppable">
                              {(provided, snapshot) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  {this.state.sizes.map((size, index) => (
                                    <Draggable
                                      key={size.name}
                                      draggableId={size.name}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          <div className="row menu-section-element rounded">
                                            <div
                                              className="col-auto nopadding"
                                              {...provided.dragHandleProps}
                                            >
                                              <div className="row">
                                                <div className="col-auto nopadding">
                                                  <i className="fas fa-bars"></i>
                                                </div>
                                                <div className="col-auto element-name nopadding">
                                                  {size.name}
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col element-name">
                                              {size.measure}
                                            </div>
                                            <div className="col element-name">
                                              {size.price}€
                                            </div>
                                            <div className="col-auto price">
                                              <div className="row">
                                                <div className="col-auto">
                                                  <button
                                                    type="button"
                                                    className="btn btn-warning"
                                                    onClick={() =>
                                                      this.setState({
                                                        editSizes: size,
                                                      })
                                                    }
                                                  >
                                                    <i className="fas fa-edit" />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                          <div className="row menu-section-element justify-content-between rounded mr-ghost">
                            <div className="col-auto nopadding">
                              <div className="row">
                                <div className="col-auto nopadding">
                                  <i className="fas fa-bars"></i>
                                </div>
                                <div className="col-auto element-name nopadding">
                                  {" "}
                                  Nuova
                                </div>
                              </div>
                            </div>

                            <div className="col-auto price">
                              <div className="row">
                                <div className="col-auto price">
                                  <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={() =>
                                      this.setState({
                                        new: true,
                                        editSizes: {
                                          name: "",
                                          measure: "",
                                          price: "",
                                        },
                                      })
                                    }
                                  >
                                    <i className="fas fa-plus" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span
                            className={
                              "input-group-text" +
                              (!this.props.valid && !this.state.price
                                ? " red"
                                : "")
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
                    )}
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
                  <div className="col-auto mt-2 vegan-toggle">
                    {this.state.sizes?.length ? null : (
                      <div className="row justify-content-center">
                        <div className="col-auto">MISURE: </div>
                        <div className="col-auto">
                          <i
                            className="fas fa-square"
                            onClick={() =>
                              this.setState({
                                editSizes: {
                                  name: "",
                                  measure: "",
                                  price: "",
                                },
                                new: true,
                              })
                            }
                          ></i>
                        </div>
                      </div>
                    )}

                    <div className="row justify-content-center">
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
                            this.state.vegan
                              ? "fas fa-check-square"
                              : "fas fa-square"
                          }
                          onClick={() =>
                            this.setState({ vegan: !this.state.vegan })
                          }
                        ></i>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-auto">NON DISPONIBILE: </div>
                      <div className="col-auto">
                        <i
                          className={
                            this.state.unavailable
                              ? "fas fa-check-square"
                              : "fas fa-square"
                          }
                          onClick={() =>
                            this.setState({
                              unavailable: !this.state.unavailable,
                            })
                          }
                        ></i>
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-center mt-2">
                    <div
                      className="col-auto alert-button m-1"
                      onClick={() => {
                        this.validate();
                        this.props.onSave({
                          _id: this.props.ingredient._id,
                          name: this.state.name,
                          price: this.state.price,
                          sizes: this.state.sizes,
                          details: this.state.details,
                          vegan: this.state.vegan,
                          unavailable: this.state.unavailable,
                        });
                      }}
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
                              _id: this.props.ingredient._id,
                              name: this.state.name,
                              price: this.state.price,
                              sizes: this.state.sizes,
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default Ingredient;
