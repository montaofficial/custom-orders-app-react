import { useState } from "react";
import MenuComponent from "../components/MenuComponentSteakhouse";

function Menu() {
  const [Menu, setMenu] = useState(null);

  return (
    <div className="page-container">
      <MenuComponent></MenuComponent>
    </div>
  );
}

export default Menu;
