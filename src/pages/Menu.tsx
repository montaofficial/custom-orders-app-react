import { useState, useEffect } from "react";
import axios from "axios";
import MenuComponentSteakhouse from "../components/MenuComponentSteakhouse";

function Menu() {
  const [menu, setMenu] = useState([]);

  const [order, updateOrder] = useState([] as any);

  //Getting menu
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

  //Editing order
  const handelOrderEdit = (prod: any) => {
    const newOrder = order;
    if (newOrder.includes(prod)) {
      const index = newOrder.indexOf(prod);
      if (index > -1) {
        newOrder.splice(index, 1);
      }
    } else {
      newOrder.push(prod);
    }

    updateOrder([...newOrder]);
  };

  return (
    <div className="page-container">
      <MenuComponentSteakhouse
        onOrderEdit={(prod: any) => handelOrderEdit(prod)}
        order={order}
        menu={menu}
      ></MenuComponentSteakhouse>
    </div>
  );
}

export default Menu;
