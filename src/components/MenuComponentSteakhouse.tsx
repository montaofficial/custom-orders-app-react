import { useState, useEffect } from "react";
import menuType from "../interfaces/menuType";
import Product from "./commons/Product";

function MenuComponentSteakhouse(props: any) {
  const { menu, order } = props;

  return (
    <div className="element-containerd">
      {menu.map((section: menuType["menu"][0]) => (
        <Product
          onOrderEdit={(prod: any) => props.onOrderEdit(prod)}
          order={order}
          section={section}
          key={section._id}
        ></Product>
      ))}
    </div>
  );
}

export default MenuComponentSteakhouse;
