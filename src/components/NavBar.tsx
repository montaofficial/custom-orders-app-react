import { Nav, Logo, Title } from "./styles/NavBar.style";

import { Button } from "./styles/Button.styled";

export default function Header() {
  return (
    <>
      <Nav>
        <Logo src="./logo-sham-low.svg" alt="" />
        <Title>ShamRock Cafè</Title>
        <Button>ORDINE</Button>
      </Nav>
    </>
  );
}
