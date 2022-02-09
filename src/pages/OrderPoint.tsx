import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { load } from "../features/menu";

function OrderPoint() {
  const dispatch = useDispatch();

  const [order, updateOrder] = useState([] as any);

  //Getting menu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          "https://orders-api.soolutions.net/api/614d9fb7db2d0588b88a006b/menus/active"
        );
        dispatch(load(response.menu));
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const menu = useSelector((state) => state.menu.value);
  console.log(menu);

  return <div className="page-container"></div>;
}

export default OrderPoint;
