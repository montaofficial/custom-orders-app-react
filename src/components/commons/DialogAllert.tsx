import React from "react";
import menuType from "../../interfaces/menuType";
import { orderType } from "../../interfaces/orderType";
import {
  DialogBase,
  DialogContent,
  DialogProp,
  DialogText,
  DialogTitle,
  SizeName,
} from "../styles/Dialog.styled";
import { Span } from "../styles/Span.styled";
import { AlertBox } from "../styles/Dialog.styled";

interface Props {
  product: menuType["menu"]["value"][0]["options"][0];
  order: orderType["order"]["value"];
  onClose: () => void;
  onOrderUpdate: (
    id: string,
    variation: number,
    sizable: boolean,
    sizeId?: string
  ) => void;
}

export const DialogAllert: React.FC<Props> = (props) => {
  let sizable: boolean;
  let singleQuantity: number = 0;
  //Generating values for the spans
  if (props.product.sizes.length < 1) {
    sizable = false;
    singleQuantity = props.order?.filter(
      (p) => p.productId === props.product?._id
    )[0]?.quantity;
    if (!singleQuantity) singleQuantity = 0;
  } else {
    sizable = true;
  }

  return (
    <>
      <DialogBase onClick={() => props.onClose()}></DialogBase>
      <DialogContent>
        <AlertBox>
          <DialogTitle></DialogTitle>
          <DialogText>{props.product?.details}</DialogText>
        </AlertBox>
      </DialogContent>
    </>
  );
};

export default DialogAllert;
