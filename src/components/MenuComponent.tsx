import axios from "axios";
import { useState, useEffect } from "react";

function MenuComponent() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          "https://orders-api.soolutions.net/api/614d9fb7db2d0588b88a006b/menu/active"
        );
        setMenu(response.menu);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>HENLOW</h1>
      {menu.map((section: any) => (
        <div key={section._id}>{section.name}</div>
      ))}
    </div>
  );
}

export default MenuComponent;
