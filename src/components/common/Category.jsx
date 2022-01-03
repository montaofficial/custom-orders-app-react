import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IconPicker } from "react-fa-icon-picker";

// Riordina i risultati
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.category._id,
      name: this.props.category.name,
      t: this.props.category.t,
      icon: this.props.category.icon,
      editable: this.props.category.editable,
      ingredients: this.props.category.ingredients,
      options: this.props.category.options,
      new: this.props.new,
      dialog: false,
      categoryOrderEdit: false,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const ingredients = reorder(
      this.state.ingredients,
      result.source.index,
      result.destination.index
    );

    this.setState({
      ingredients,
    });
  }

  render() {
    return (
      <>
        <div id="dialog_base" onClick={() => this.props.onClose()}></div>
        <div id="dialog_content">
          <div className="card alert-box">
            <div className="alert-text">
              {this.state.dialog ? (
                <>
                  {this.state.categoryOrderEdit && this.state.editable ? (
                    <div className="row justify-content-center">
                      <h2>Modifica ordine ingredienti</h2>
                      <div className="col-auto">
                        <DragDropContext onDragEnd={this.onDragEnd}>
                          <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {this.state.ingredients.map(
                                  (category, index) => (
                                    <Draggable
                                      key={category.name}
                                      draggableId={category.name}
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
                                              <i className="fas fa-bars"></i>
                                            </div>
                                            <div className="col element-name">
                                              {category.name}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                      <div className="row justify-content-center mt-2">
                        <div
                          className="col-auto alert-button m-1"
                          onClick={() =>
                            this.setState({
                              categoryOrderEdit: false,
                              dialog: false,
                            })
                          }
                        >
                          <i className="fas fa-check" /> FATTO
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="row justify-content-center">
                      <h2>Sei sicuro di voler eliminare?</h2>
                      <div className="row justify-content-center mt-2">
                        <div
                          className="col-auto alert-button m-1"
                          onClick={() => {
                            this.props.onSave(
                              {
                                _id: this.props.category._id,
                                name: this.state.name,
                                icon: this.state.icon,
                                t: this.state.t,
                                editable: this.state.editable,
                                ingredients: this.state.ingredients,
                                options: this.state.options,
                              },
                              true
                            );
                            this.setState({ dialog: false });
                          }}
                        >
                          <i className="fas fa-trash-alt" /> ELIMINA
                        </div>
                        <div
                          className="col-auto alert-button m-1"
                          onClick={() => this.setState({ dialog: null })}
                        >
                          <i className="fas fa-times"></i> ANNULLA
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {this.state.icon ? (
                    <div className="row justify-content-center">
                      <div
                        className="col-auto alert-button"
                        onClick={() => this.setState({ icon: "" })}
                      >
                        RIMUOVI ICONA
                      </div>
                    </div>
                  ) : null}
                  <div className="row justify-content-center">
                    <div className="col-auto">
                      <div className="icon-picker">
                        <IconPicker
                          buttonIconStyles={{
                            color: "#f0dd31",
                            fontSize: "3rem",
                          }}
                          value={this.state.icon ? this.state.icon : "FaIcons"}
                          onChange={(v) => this.setState({ icon: v })}
                        ></IconPicker>
                      </div>
                      <div>[modifica icona]</div>
                    </div>
                  </div>

                  <div className="row justify-content-center">
                    <div className="col-auto mt-4">
                      <h2>
                        {this.props.new
                          ? "AGGIUNGI CATEGORIA"
                          : "MODIFICA CATEGORIA"}
                      </h2>
                    </div>
                  </div>
                  {this.props.valid ? null : (
                    <div className="red">NOME E TIPO SONO OBBLIGATORI</div>
                  )}
                  {this.props.nameAlreadyUsed ? (
                    <div className="red">NOME GIÀ UTILIZZATO</div>
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
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span
                          className={
                            "input-group-text" +
                            (!this.props.valid && !this.state.t ? " red" : "")
                          }
                          id="inputGroup-sizing-default"
                        >
                          Tipo
                        </span>
                      </div>
                      <input
                        className="form-control tuttoaddestra-text"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={this.state.t}
                        onChange={({ currentTarget: input }) =>
                          this.setState({ t: input.value.toLowerCase() })
                        }
                      />
                    </div>
                  </div>
                  {this.state.new ? (
                    <div className="row justify-content-center mt-2 vegan-toggle">
                      <div className="col-auto">
                        PERSONALIZZABILE{" "}
                        <span className="">
                          <i className="fas fa-user-edit"></i>
                        </span>
                        :{" "}
                      </div>
                      <div className="col-auto">
                        <i
                          className={
                            this.state.editable
                              ? "fas fa-check-square"
                              : "fas fa-square"
                          }
                          onClick={() =>
                            this.setState({ editable: !this.state.editable })
                          }
                        ></i>
                      </div>
                    </div>
                  ) : null}

                  {this.state.editable &&
                  !this.state.new &&
                  this.state.ingredients.length > 1 ? (
                    <div className="row justify-content-center mt-2 vegan-toggle">
                      <div
                        className="col-auto alert-button m-1"
                        onClick={() => {
                          let ingredients = this.state.ingredients;
                          if (ingredients.length) {
                            ingredients = this.state.ingredients;
                          } else {
                            ingredients = [];
                          }
                          this.setState({
                            dialog: true,
                            categoryOrderEdit: true,
                            ingredients: ingredients,
                          });
                        }}
                      >
                        <i className="fas fa-edit"></i> MODIFICA ORDINE
                        INGREDIENTI
                      </div>
                    </div>
                  ) : null}

                  <div className="row justify-content-center mt-2">
                    <div
                      className="col-auto alert-button m-1"
                      onClick={() =>
                        this.props.onSave({
                          _id: this.props.category._id,
                          name: this.state.name,
                          icon: this.state.icon,
                          t: this.state.t,
                          editable: this.state.editable,
                          ingredients: this.state.ingredients,
                          options: this.state.options,
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
                    {this.state.new ? null : (
                      <div
                        className="col-auto alert-button m-1"
                        onClick={() => this.setState({ dialog: true })}
                      >
                        <i className="fas fa-trash-alt" /> ELIMINA
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Category;
