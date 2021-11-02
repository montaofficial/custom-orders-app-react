import React from "react";
import { Redirect } from "react-router-dom";

import "../login.css";

const baseUrl = "https://orders-api.soolutions.net/api/";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      name: "",
      password: "",
      loggedIn: false,
      visiblePassword: false,
    };
  }

  componentDidMount() {}

  keyDown(event) {
    if (event.keyCode === "13") {
      this.login();
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loggedIn ? (
          <Redirect to={{ pathname: "/", state: { from: null } }} />
        ) : null}
        <div
          className="container"
          onKeyDown={(e) => {
            this.keyDown(e);
          }}
        >
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-9 col-lg-8">
              <div className=" login-card">
                <div className="row justify-content-center">
                  <div className="col-auto">
                    <img
                      src="/logo-sham-low.svg"
                      className="logo-login"
                      alt="Logo PGE"
                    ></img>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-12">
                    <h3 className="login-title white">AMMINISTRAZIONE</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="description-login">Username</div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-12 pb-2 pt-1">
                    <div className="wrap-input100 validate-input">
                      <input
                        className="input100"
                        type="text"
                        id="nome"
                        name="nome"
                        onKeyDown={(e) => {
                          this.keyDown(e);
                        }}
                        value={this.state.name}
                        onChange={(event) => {
                          this.setState(
                            Object.assign({}, this.state, {
                              name: event.target.value,
                            })
                          );
                        }}
                      />
                      <span className="focus-input100"></span>
                      <span className="symbol-input100"></span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="description-login">Password</div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-12 pb-2 pt-1">
                    <div className="wrap-input100 validate-input">
                      {this.state.visiblePassword ? (
                        <span
                          className="symbol-input100"
                          onClick={() => {
                            this.setState({
                              visiblePassword: !this.state.visiblePassword,
                            });
                          }}
                        >
                          <i className="fa fa-eye-slash" aria-hidden="true"></i>
                        </span>
                      ) : (
                        <span
                          className="symbol-input100"
                          onClick={() => {
                            this.setState({
                              visiblePassword: !this.state.visiblePassword,
                            });
                          }}
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </span>
                      )}
                      <input
                        className="input100"
                        type={this.state.visiblePassword ? "text" : "password"}
                        name="id"
                        id="id"
                        onKeyDown={(e) => {
                          this.keyDown(e);
                        }}
                        value={this.state.password}
                        onChange={(event) => {
                          this.setState(
                            Object.assign({}, this.state, {
                              password: event.target.value,
                            })
                          );
                        }}
                      />
                      <span className="focus-input100"></span>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-12 pb-2 pt-1">
                    <div className="container-login100-form-btn">
                      <button
                        className="login100-form-btn submit2"
                        onClick={() => {
                          this.login();
                        }}
                        onKeyDown={(e) => {
                          this.keyDown(e);
                        }}
                        type="submit"
                      >
                        {this.state.loading ? (
                          <img src="/logo-sham-low.svg" alt="loading..." />
                        ) : (
                          "Accedi"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {this.state.error ? (
                  <div className="row justify-content-center">
                    <div className="col-12 pt-3">
                      <div className="alert alert-danger w3-animate-fading">
                        <div>
                          <i className="fas fa-exclamation-triangle"></i> I tuoi
                          dati sono sbagliati! Riprova.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  async login() {
    try {
      let response = await fetch(`${baseUrl}/auth`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: this.state.password.trim(),
          username: this.state.name.trim(),
          browser: {
            codeName: navigator.appCodeName,
            name: navigator.vendor,
            version: navigator.appVersion,
            cookies: navigator.cookieEnabled,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
          },
        }),
      });

      if (!response.ok) {
        response.text().then((res) => console.log(res));
        this.setState(
          Object.assign({}, this.state, {
            error: true,
            loading: false,
          })
        );
        setTimeout(() => {
          this.setState(
            Object.assign({}, this.state, {
              error: false,
            })
          );
        }, 6000);
        return;
      }
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        console.log(e.message);
      }
      if (data && data.token)
        localStorage.setItem("custom-orders-token", data.token);
      this.props.callBack();
    } catch (e) {
      console.log(e.message);
    }
  }
}

export default Login;
