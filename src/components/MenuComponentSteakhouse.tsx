import axios from "axios";
import { useState, useEffect } from "react";
import menuType from "../interfaces/menuType";
import Product from "./commons/Product";

function MenuComponentSteakhouse() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          "https://orders-api.soolutions.net/api/614d9fb7db2d0588b88a006b/menus/active"
        );
        setMenu(response.menu);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="element-containerd">
      {menu.map((section: menuType["menu"][0]) => (
        <Product section={section} key={section._id}></Product>
      ))}
    </div>
  );
}

export default MenuComponentSteakhouse;
