import "./App.css";
import OrderPoint from "./components/OrderPoint";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./components/styles/Global";
import React from "react";
import NavBar from "./components/NavBar";

import { Container } from "./components/styles/Container.styled";

const theme = {
  colors: {
    navbar: "#1d1d1d",
    background: "#000000",
    backgroundSecondary: "#1d1d1d",
    container: "#000000",
    fill: "rgb(255, 193, 7)",
    textClear: "#f0dd31",
    textDark: "#03071E",
    shadow: "rgb(255, 193, 7)",
  },
  mobile: "590px",
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyles />
        <NavBar></NavBar>
        <Container>
          <OrderPoint />
        </Container>
      </>
    </ThemeProvider>
  );
}

export default App;
