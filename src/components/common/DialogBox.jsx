import React, { Component } from "react";

class DialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: 0,
    };
  }

  render() {
    return (
      <>
        <div id="dialog_base" onClick={() => this.props.onClose()}></div>
        <div id="dialog_content">
          <div className="card alert-box">
            <div className="alert-text">
              <h4 className="yellow">{this.props.dialog.title}</h4>

              {this.props.dialog.menus ? (
                <>
                  <div className="row justify-content-center">
                    {console.log(this.props.dialog.menus)}
                    {this.props.dialog.menus.map((m, key) => (
                      <div
                        key={key}
                        className={
                          m.active === 1
                            ? "rounded col-auto menu-section-menu-pick-selected"
                            : "rounded col-auto menu-section-menu-pick"
                        }
                      >
                        {m.name}
                        {m.active === 1 ? (
                          <div className="menu-active-badge rounded">
                            Attivo
                          </div>
                        ) : null}
                      </div>
                    ))}
                    <div
                      className="rounded col-auto menu-section-menu-pick"
                      onClick={() => this.props.onModMenu("new")}
                    >
                      {" "}
                      +{" "}
                    </div>
                  </div>
                </>
              ) : (
                <div className="white">{this.props.dialog.text}</div>
              )}

              <div className="row justify-content-center mt-2">
                {this.props.admin ? (
                  <>
                    {this.props.dialog.action === "switch" ? (
                      <div
                        className="col-auto alert-button m-1"
                        onClick={() =>
                          this.props.onModMenu(this.state.selected)
                        }
                      >
                        <i className="far fa-check-circle"></i> ATTIVA
                      </div>
                    ) : null}

                    {this.props.dialog.action === "switch" ? (
                      <div
                        className="col-auto alert-button m-1"
                        onClick={() =>
                          this.props.onModMenu(this.state.selected)
                        }
                      >
                        <i className="far fa-edit"></i> MODIFICA
                      </div>
                    ) : null}

                    {this.props.dialog.action === "save" ? (
                      <div
                        className="col-auto alert-button m-1"
                        onClick={() => this.props.onSaveMenu()}
                      >
                        <i className="far fa-save"></i> SALVA
                      </div>
                    ) : null}

                    {this.props.dialog.action === "delete" ? (
                      <div className="col-auto alert-button m-1">
                        <i className="far fa-save"></i> ELIMINA
                      </div>
                    ) : null}
                  </>
                ) : null}

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
