import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loadMenu } from "../features/menu";
import { useEffect } from "react";
import OrderPoint from "./OrderPoint";
import OrderReview from "./OrderReview";
import CustomConfigurator from "./commons/CustomConfigurator";

export const PageController = () => {
  const currentPage = useSelector(
    (state: { currentPage: { value: string } }) => state.currentPage.value
  );
  const dispatch = useDispatch();

  //Getting menu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          "https://orders-api.soolutions.net/api/614d9fb7db2d0588b88a006b/menus/active"
        );
        dispatch(loadMenu(response.menu));
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {currentPage === "OrderPoint" ? <OrderPoint /> : null}
      {currentPage === "OrderReview" ? <OrderReview /> : null}
      {currentPage === "Tables" ? <OrderPoint /> : null}
    </>
  );
};

export default PageController;
