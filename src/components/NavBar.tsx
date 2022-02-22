//Interfaces
import { orderType } from "../interfaces/orderType";

//Styled Components
import { Nav, Logo, Title } from "./styles/NavBar.style";
import { Button } from "./styles/Button.styled";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { changePage } from "../features/currentPage";

export default function Header() {
  const dispatch = useDispatch();

  const currentPage = useSelector(
    (state: { currentPage: { value: string } }) => state.currentPage.value
  );
  let order = useSelector((state: orderType) => state.order.value);

  //Creating order id array
  const orderProductsIds = order
    .filter((o) => o.quantity > 0)
    .map((o) => o.productId);

  const buttonState = () => {
    if (orderProductsIds.length === 0 && currentPage === "OrderPoint")
      return true;
    else return false;
  };

  return (
    <>
      <Nav>
        <Logo src="./logo-sham-low.svg" alt="" />
        <Title>ShamRock Cafè</Title>
        <Button
          disabled={buttonState()}
          onClick={() => {
            if (currentPage === "OrderPoint" && !buttonState()) {
              dispatch(changePage("OrderReview"));
            }
            if (currentPage === "OrderReview")
              dispatch(changePage("OrderPoint"));
          }}
        >
          {currentPage === "OrderPoint" ? "ORDINE" : null}
          {currentPage === "OrderReview" ? "MENÙ" : null}
        </Button>
      </Nav>
    </>
  );
}
