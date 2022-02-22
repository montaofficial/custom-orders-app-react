import "./App.css";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./components/styles/Global";
import NavBar from "./components/NavBar";
import { Container } from "./components/styles/Container.styled";
import PageController from "./components/PageController";

const theme = {
  colors: {
    navbar: "#1d1d1d",
    background: "#000000",
    backgroundSecondary: "#1d1d1d",
    container: "#000000",
    fill: "rgb(255, 193, 7)",
    textPrimary: "#f0dd31",
    textSecondary: "#03071E",
    textTertiary: "#ffffff",
    shadow: "rgb(255, 193, 7)",
  },
  mobile: "400px",
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <div className="noselect">
          <GlobalStyles />
          <NavBar></NavBar>
          <Container>
            <PageController />
          </Container>
        </div>
      </>
    </ThemeProvider>
  );
}

export default App;
