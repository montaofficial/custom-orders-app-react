import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import menuReducer from "./features/menu";
import orderReducer from "./features/order";
import currentPageReducer from "./features/currentPage";

const store = configureStore({
  reducer: {
    menu: menuReducer,
    order: orderReducer,
    currentPage: currentPageReducer,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
