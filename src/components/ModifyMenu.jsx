import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Ingredient from "./common/Ingredient";
import IngredientCategory from "./common/IngredientCategory";
import Category from "./common/Category";
import Menu from "./common/Menu";
import DialogBox from "./common/DialogBox";
import { IconPickerItem } from "react-fa-icon-picker";
import NavBar from "./common/NavBar";
const axios = require("axios");
const baseUrl = "https://orders-api.soolutions.net/api/";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class ModifyMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuObject: null,
      currentMenu_id: "",
      menus: [],
      menu: [],
      menuName: "",
      editMenu: 0,
      menuM: null,
      product: null,
      ingredient: null,
      ingredientCategory: null,
      option: null,
      uneditable: false,
      new: false,
      valid: true,
      nameAlreadyUsed: false,
      newCategory: false,
      category: null,
      dialog: false,
      expanded: [],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        baseUrl + `${this.props?.match?.params?.idRistorante}/menus/active`
      );

      this.setState({
        currentMenu_id: response.data._id,
        menu: response.data.menu,
        menuName: response.data.name,
        menuObject: response.data,
      });
    } catch (error) {
      console.error(error);
    }
    try {
      const response = await axios.get(
        baseUrl + `${this.props?.match?.params?.idRistorante}/menus`
      );
      this.setState({
        menus: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  onDragEnd(result) {
    // rilasciato al di fuori della lista
    if (!result.destination) {
      return;
    }

    const mod = result.draggableId.split("/..+.-.+../");

    let newMenu = this.state.menu;
    const productIndex = newMenu.findIndex((p) => p.name === mod[0]);

    //For editable products
    if (mod.length === 3) {
      const ingredientIndex = newMenu[productIndex].ingredients.findIndex(
        (i) => i.name === mod[1]
      );

      //Reordering
      const reordered = reorder(
        newMenu[productIndex].ingredients[ingredientIndex].options,
        result.source.index,
        result.destination.index
      );

      //Creating the reordered menu
      newMenu[productIndex].ingredients[ingredientIndex].options = reordered;
    }

    //For uneditable products
    if (mod.length === 2) {
      const reordered = reorder(
        newMenu[productIndex].options,
        result.source.index,
        result.destination.index
      );

      //Creating the reordered menu
      newMenu[productIndex].options = reordered;
    }

    this.setState({ menu: newMenu });
  }

  saveProduct = (modI, del) => {
    console.log("MI hanno chiesto di salvare: ", modI);
    if (
      (modI.name === "" ||
        modI.price === "" ||
        modI.price === undefined ||
        modI.price === null) &&
      !del &&
      !modI.sizes?.length
    ) {
      this.setState({ valid: false });
      return;
    } else {
      this.setState({ valid: true });
    }

    //Cloning the current menu
    let newMenu = this.state.menu;

    //Searcing for the product Index
    const productIndex = newMenu.findIndex((p) => p === this.state.product);

    if (this.state.product.editable) {
      //Searcing the Index of the ingredient
      const ingredientIndex = newMenu[productIndex].ingredients.findIndex(
        (i) => i === this.state.ingredient
      );

      //If new, adding the option
      if (this.state.new) {
        //Checking if name already been used
        const nameAlreadyUsed = newMenu[productIndex].ingredients[
          ingredientIndex
        ].options.filter((o) => o.name === modI.name);

        if (nameAlreadyUsed.length !== 0) {
          this.setState({ nameAlreadyUsed: true });
          return;
        } else {
          this.setState({ nameAlreadyUsed: false });
        }

        newMenu[productIndex].ingredients[ingredientIndex].options.push(modI);
      }
      //If not new
      else {
        //Searcing for the index of the option
        const optionsIndex = newMenu[productIndex].ingredients[
          ingredientIndex
        ].options.findIndex((o) => o === this.state.option);

        //if delete command deleting the option
        if (del) {
          if (optionsIndex > -1) {
            newMenu[productIndex].ingredients[ingredientIndex].options.splice(
              optionsIndex,
              1
            );
          }
        }
        //Updating the option
        else {
          newMenu[productIndex].ingredients[ingredientIndex].options[
            optionsIndex
          ] = modI;
        }
      }
    }
    //For uneditable product
    else {
      //If new, adding the option
      if (this.state.new) {
        //Checking if name already been used
        const nameAlreadyUsed = newMenu[productIndex].options.filter(
          (o) => o.name === modI.name
        );

        if (nameAlreadyUsed.length !== 0) {
          this.setState({ nameAlreadyUsed: true });
          return;
        } else {
          this.setState({ nameAlreadyUsed: false });
        }

        newMenu[productIndex].options.push(modI);
      }

      //Searcing for the option Index
      else {
        const optionsIndex = newMenu[productIndex].options.findIndex(
          (o) => o === this.state.option
        );

        //if delete command deleting the option
        if (del) {
          if (optionsIndex > -1) {
            newMenu[productIndex].options.splice(optionsIndex, 1);
          }
        }

        //Updating the option
        else {
          newMenu[productIndex].options[optionsIndex] = modI;
        }
      }
    }

    this.setState({
      menu: newMenu,
      product: null,
      ingredient: null,
      option: null,
      new: false,
      valid: true,
    });
  };

  saveCategory = (modC, del) => {
    console.log(modC);
    let newMenu = this.state.menu;

    let modCNew = modC;

    if (modC.editable && !modC.ingredients) {
      modCNew.ingredients = [];
    }
    if (!modC.editable && !modC.options) {
      modCNew.options = [];
    }

    const productIndex = newMenu.findIndex(
      (p) => p.name === this.state.category.name
    );
    const nameAlreadyUsed = newMenu.filter((p) => p.name === modCNew.name);

    if (del) {
      if (productIndex > -1) {
        newMenu.splice(productIndex, 1);
      }
    } else {
      if ((modCNew.name === "" || modCNew.t === "") && !del) {
        this.setState({ valid: false });
        return;
      } else {
        this.setState({ valid: true });
      }
      if (
        nameAlreadyUsed.length !== 0 &&
        modCNew.name !== this.state.category.name
      ) {
        this.setState({ nameAlreadyUsed: true });
        return;
      } else {
        this.setState({ nameAlreadyUsed: false });
      }

      if (this.state.new) {
        newMenu.push(modCNew);
      } else {
        newMenu[productIndex] = modCNew;
      }
    }

    this.setState({
      menu: newMenu,
      category: null,
      product: null,
      ingredient: null,
      option: null,
      new: false,
      valid: true,
    });
  };

  saveIngredientCategory = (modIC, del) => {
    let newMenu = this.state.menu;

    const productIndex = newMenu.findIndex(
      (p) => p.name === this.state.product.name
    );

    //Checking for empty string
    if (modIC.name === "") {
      this.setState({ valid: false });
      return;
    } else {
      this.setState({ valid: true });
    }

    //Checking if name already used
    const nameAlreadyUsed = newMenu[productIndex].ingredients.filter(
      (i) => i.name === modIC.name
    );

    if (
      nameAlreadyUsed.length !== 0 &&
      !del &&
      modIC.name !== this.state.ingredientCategory.name
    ) {
      this.setState({ nameAlreadyUsed: true });
      return;
    } else {
      this.setState({ nameAlreadyUsed: true });
    }

    if (this.state.new) {
      let newIC = modIC;
      newIC.options = [];
      newMenu[productIndex].ingredients.push(newIC);
    } else {
      const ingredientIndex = newMenu[productIndex].ingredients.findIndex(
        (i) => i.name === this.state.ingredientCategory.name
      );
      if (del) {
        if (ingredientIndex > -1) {
          newMenu[productIndex].ingredients.splice(ingredientIndex, 1);
        }
      } else {
        let newIngredientCategory =
          newMenu[productIndex].ingredients[ingredientIndex];

        newIngredientCategory.name = modIC.name;
        newIngredientCategory.single = modIC.single;
        newMenu[productIndex].ingredients[ingredientIndex] =
          newIngredientCategory;
      }
    }

    this.setState({
      menu: newMenu,
      option: null,
      ingredient: null,
      category: null,
      valid: true,
      new: false,
      ingredientCategory: null,
      nameAlreadyUsed: false,
    });
  };

  handleModMenu = (m) => {
    console.log(m);
  };

  async handleSaveMenu() {
    let menuObject = this.state.menuObject;
    menuObject.menu = this.state.menu;
    console.log("POSTO: ", menuObject);
    console.log(
      "POSTO SU: ",
      baseUrl +
        `${this.props?.match?.params?.idRistorante}/menus/${this.state.currentMenu_id}`
    );
    try {
      const response = await axios.post(
        baseUrl +
          `${this.props?.match?.params?.idRistorante}/menus/${this.state.currentMenu_id}`,
        menuObject
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <>
        <NavBar
          whiteTitle="MODIFICA"
          yellowTitle="MENU"
          icon1="fas fa-save"
          icon2="fas fa-clipboard-list"
          btn1Text="SALVA"
          btn2Text="MENU"
          onButton1={() =>
            this.setState({
              dialog: {
                title: "Sei sicuro di voler salvare?",
                text: "Una volta salvato non sarà più possibile tornare indietro!",
                action: "save",
              },
            })
          }
          onButton2={() =>
            this.setState({
              dialog: {
                title: "Quale menù desideri modificare?",
                menus: this.state.menus,
                action: "switch",
              },
            })
          }
        ></NavBar>

        {this.state.dialog ? (
          <DialogBox
            onClose={() => {
              this.setState({ dialog: null });
            }}
            onSaveMenu={() => this.handleSaveMenu()}
            onModMenu={(m) => this.handleModMenu(m)}
            admin={true}
            dialog={this.state.dialog}
          />
        ) : null}

        {this.state.menuM ? (
          <Menu
            menu={this.state.menuM}
            onSaveMenuName={(m) => this.handleSaveMenuName(m)}
            onClose={() => {
              this.setState({ menuM: null });
            }}
          />
        ) : null}

        {this.state.category ? (
          <Category
            onSave={(c, del) => this.saveCategory(c, del)}
            onClose={() => {
              this.setState({
                category: null,
                valid: true,
                nameAlreadyUsed: false,
                new: false,
              });
            }}
            category={this.state.category}
            new={this.state.new}
            valid={this.state.valid}
            nameAlreadyUsed={this.state.nameAlreadyUsed}
          />
        ) : null}

        {this.state.option ? (
          <Ingredient
            onSave={(i, del) => this.saveProduct(i, del)}
            onClose={() => {
              this.setState({
                option: null,
                ingredient: null,
                category: null,
                valid: true,
                new: false,
                uneditable: false,
                nameAlreadyUsed: false,
              });
            }}
            ingredient={this.state.option}
            new={this.state.new}
            uneditable={this.state.uneditable}
            valid={this.state.valid}
            nameAlreadyUsed={this.state.nameAlreadyUsed}
          />
        ) : null}

        {this.state.ingredientCategory ? (
          <IngredientCategory
            onSave={(iC, del) => this.saveIngredientCategory(iC, del)}
            onClose={() => {
              this.setState({
                option: null,
                ingredient: null,
                category: null,
                valid: true,
                new: false,
                ingredientCategory: null,
                nameAlreadyUsed: false,
              });
            }}
            ingredientCategory={this.state.ingredientCategory}
            new={this.state.new}
            nameAlreadyUsed={this.state.nameAlreadyUsed}
            valid={this.state.valid}
          />
        ) : null}

        <div className="mt-5">
          .
          <div className="yellow menu-title mt-2 rounded">
            Modifica il menù "{this.state.menuName}"
          </div>
          {this.state.menu.map((product, key) => (
            <div className="menu-section rounded mt-3" key={key}>
              <div className="menu-section-title">
                <div className="row justify-content-start">
                  <div className="col-auto big">
                    <div className="row">
                      <div className="col-auto no-padding">
                        <IconPickerItem
                          icon={product.icon}
                          size={30}
                          color="#f0dd31"
                        />
                      </div>
                      <div className="col-auto no-padding">{product.name}</div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-warning mt-2"
                      onClick={() => this.setState({ category: product })}
                    >
                      <i className="fas fa-edit" />
                    </button>
                  </div>
                </div>
                <div
                  className="element-description"
                  onClick={() => {
                    let expanded = this.state.expanded;
                    if (expanded.includes(product.name)) {
                      const index = expanded.indexOf(product.name);
                      if (index > -1) {
                        expanded.splice(index, 1);
                      }
                    } else {
                      expanded.push(product.name);
                    }
                    this.setState({ expanded });
                  }}
                >
                  {this.state.expanded.includes(product.name)
                    ? "↑ nascondi"
                    : "↓ mostra"}
                </div>
                <div>
                  {this.state.expanded.includes(product.name) ? (
                    <div>
                      {/*PRODOTTI EDITABILI*/}
                      {product.editable ? (
                        <div className="menu-section-list">
                          {product.ingredients.map((ingredient, key2) => (
                            <div key={key2}>
                              <div className="menu-section-title row mt-5">
                                {ingredient.name}{" "}
                                {ingredient.single ? "(Scelta Singola)" : null}
                                <div className="col-auto">
                                  <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={() =>
                                      this.setState({
                                        product: product,
                                        ingredientCategory: ingredient,
                                      })
                                    }
                                  >
                                    <i className="fas fa-edit" />
                                  </button>
                                </div>
                              </div>
                              <DragDropContext onDragEnd={this.onDragEnd}>
                                <Droppable droppableId="droppable">
                                  {(provided, snapshot) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                    >
                                      {ingredient.options.map(
                                        (option, index) => (
                                          <Draggable
                                            key={option.name}
                                            draggableId={`${product.name}/..+.-.+../${ingredient.name}/..+.-.+../${option.name}`}
                                            index={index}
                                          >
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                              >
                                                <div
                                                  className={
                                                    option.unavailable
                                                      ? "row justify-content-between menu-section-element rounded mr-ghost"
                                                      : "row justify-content-between menu-section-element rounded"
                                                  }
                                                >
                                                  <div
                                                    className="col-auto nopadding"
                                                    {...provided.dragHandleProps}
                                                  >
                                                    <i className="fas fa-bars"></i>
                                                  </div>
                                                  <div className="col">
                                                    <div className="row justify-content-between">
                                                      <div className="col element-name">
                                                        {option.name}
                                                        {option.vegan ? (
                                                          <span className="element-vegan">
                                                            <i className="fas fa-leaf"></i>
                                                          </span>
                                                        ) : null}
                                                        <div className="element-description">
                                                          {option.details}
                                                        </div>
                                                      </div>
                                                      {option.price ? (
                                                        <div className="col-auto price nopadding">
                                                          <>{option.price}€</>
                                                        </div>
                                                      ) : null}
                                                      <div className="col-auto price">
                                                        <div className="col-auto">
                                                          <button
                                                            type="button"
                                                            className="btn btn-warning"
                                                            onClick={() =>
                                                              this.setState({
                                                                product:
                                                                  product,
                                                                ingredient:
                                                                  ingredient,
                                                                option: option,
                                                              })
                                                            }
                                                          >
                                                            <i className="fas fa-edit" />
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div>
                                                      {option.sizes ? (
                                                        <div className="row justify-content-start">
                                                          {option.sizes.map(
                                                            (size, key3) => (
                                                              <div
                                                                className="col-3 small-padding"
                                                                key={key3}
                                                              >
                                                                <div className="sizes-pills rounded">
                                                                  {size.name}/
                                                                  {size.price}€
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                        </div>
                                                      ) : null}
                                                    </div>
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
                              <div className="row menu-section-element rounded mr-ghost">
                                <div className="col-auto nopadding">
                                  <i className="fas fa-bars"></i>
                                </div>
                                <div className="col element-name">
                                  NUOVA OPZIONE
                                  <div className="element-description">
                                    Clicca sul tasto per aggiungere
                                  </div>
                                </div>
                                <div className="col-auto price">
                                  <div className="row">
                                    <div className="col-auto">
                                      <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={() =>
                                          this.setState({
                                            new: true,
                                            product: product,
                                            ingredient: ingredient,
                                            option: {
                                              name: "",
                                              price: "",
                                              details: "",
                                              vegan: false,
                                              unavailable: false,
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
                          ))}
                          <div>
                            <div className="menu-section-title row mt-5">
                              NUOVO INGREDIENTE
                              <div className="col-auto">
                                <button
                                  type="button"
                                  className="btn btn-warning"
                                  onClick={() =>
                                    this.setState({
                                      ingredientCategory: {
                                        name: "",
                                        single: false,
                                      },
                                      product: product,
                                      new: true,
                                    })
                                  }
                                >
                                  <i className="fas fa-plus" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/*PRODOTTI NON EDITABILI*/}
                          <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId="droppable">
                              {(provided, snapshot) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  {product.options.map((option, index) => (
                                    <Draggable
                                      key={option.name}
                                      draggableId={`${product.name}/..+.-.+../${option.name}`}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                        >
                                          <div
                                            className={
                                              option.unavailable
                                                ? "row justify-content-between menu-section-element rounded mr-ghost"
                                                : "row justify-content-between menu-section-element rounded"
                                            }
                                          >
                                            <div
                                              className="col-auto nopadding"
                                              {...provided.dragHandleProps}
                                            >
                                              <i className="fas fa-bars"></i>
                                            </div>
                                            <div className="col">
                                              <div className="row justify-content-between">
                                                <div className="col element-name">
                                                  {option.name}
                                                  {option.vegan ? (
                                                    <span className="element-vegan">
                                                      <i className="fas fa-leaf"></i>
                                                    </span>
                                                  ) : null}
                                                  <div className="element-description">
                                                    {option.details}
                                                  </div>
                                                </div>
                                                {option.price ? (
                                                  <div className="col-auto price nopadding">
                                                    <>{option.price}€</>
                                                  </div>
                                                ) : null}
                                                <div className="col-auto price">
                                                  <div className="col-auto">
                                                    <button
                                                      type="button"
                                                      className="btn btn-warning"
                                                      onClick={() =>
                                                        this.setState({
                                                          product: product,
                                                          option: option,
                                                        })
                                                      }
                                                    >
                                                      <i className="fas fa-edit" />
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                              <div>
                                                {option.sizes ? (
                                                  <div className="row justify-content-start">
                                                    {option.sizes.map(
                                                      (size, key3) => (
                                                        <div
                                                          className="col-3 small-padding"
                                                          key={key3}
                                                        >
                                                          <div className="sizes-pills rounded">
                                                            {size.name}/
                                                            {size.price}€
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                ) : null}
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
                          <div className="row menu-section-element rounded mr-ghost">
                            <div className="col-auto nopadding">
                              <i className="fas fa-bars"></i>
                            </div>
                            <div className="col element-name">
                              NUOVA OPZIONE
                              <div className="element-description">
                                Clicca sul tasto per aggiungere
                              </div>
                            </div>
                            <div className="col-auto price">
                              <div className="row">
                                <div className="col-auto">
                                  <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={() =>
                                      this.setState({
                                        new: true,
                                        product: product,
                                        uneditable: true,
                                        option: {
                                          name: "",
                                          price: "",
                                          details: "",
                                          vegan: false,
                                          unavailable: false,
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
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
          {/*NUOVA CATEGORIA */}
          <div
            className="menu-section rounded mt-5 mr-ghost"
            onClick={() =>
              this.setState({
                new: true,
                category: { name: "", t: "", icon: "", editable: false },
              })
            }
          >
            <div className="row justify-content-center">
              <div className="menu-section-title">
                <div className="row justify-content-start">
                  <div className="col-auto big">
                    <div className="row">
                      <div className="col-auto no-padding">
                        <IconPickerItem
                          icon={"FaPlus"}
                          size={30}
                          color="#f0dd31"
                        />
                      </div>
                      <div className="col-auto no-padding">AGGIUNGI</div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-warning mt-2"
                      onClick={() => this.setState({})}
                    >
                      <i className="fas fa-plus" />
                    </button>
                  </div>
                </div>
                <div className="element-description">
                  [clicca per aggiungere]
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ModifyMenu;
