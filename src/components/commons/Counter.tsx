import React from "react";
import menuType from "../../interfaces/menuType";
import { orderType } from "../../interfaces/orderType";
import { AddButton } from "../styles/Button.styled";
import { DialogBase, DialogContent } from "../styles/Dialog.styled";
import { Flex } from "../styles/Flex.style";
import { Span } from "../styles/Span.styled";
import { AlertBox } from "./../styles/Dialog.styled";

interface Props {
  product: menuType["menu"]["value"][0]["options"][0] | null;
  order: orderType | null;
  onClose: () => void;
  onOrderUpdate: (id: string | undefined, variation: number) => void;
}

export const Counter: React.FC<Props> = (props) => {
  let quantity = props.order?.filter(
    (p) => p.productId === props.product?._id
  )[0]?.quantity;
  if (!quantity) quantity = 0;

  return (
    <>
      <DialogBase onClick={() => props.onClose()}></DialogBase>
      <DialogContent>
        <AlertBox>
          <h4 className="yellow">{props.product?.name}</h4>
          <Flex>
            <p>{props.product?.details}</p>
            <AddButton
              onClick={() => props.onOrderUpdate(props.product?._id, -1)}
            >
              -
            </AddButton>
            <Span>{quantity}</Span>
            <AddButton
              onClick={() => props.onOrderUpdate(props.product?._id, +1)}
            >
              +
            </AddButton>
          </Flex>
        </AlertBox>
      </DialogContent>
    </>
  );
};

export default Counter;
