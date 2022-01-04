import { useState } from "react";
import MenuComponent from "../components/MenuComponent";

function Menu() {
  const [Menu, setMenu] = useState(null);

  return (
    <div>
      <MenuComponent></MenuComponent>
    </div>
  );
}

export default Menu;
