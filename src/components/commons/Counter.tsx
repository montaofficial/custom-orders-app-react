import React from "react";
import menuType from "../../interfaces/menuType";
import { orderType } from "../../interfaces/orderType";
import { AddButton, DisabledAddButton } from "../styles/Button.styled";
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

export const Counter: React.FC<Props> = (props) => {
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
          <DialogTitle>{props.product?.name}</DialogTitle>
          <DialogText>{props.product?.details}</DialogText>
          {props.product.sizes.length ? (
            <div>
              {props.product.sizes.map((size) => (
                <div key={size._id}>
                  <SizeName>{size.name}</SizeName>
                  <DialogProp>
                    {props.order
                      .filter((e) => e.productId === props.product._id)[0]
                      ?.sizes.filter((s) => s.sizeId === size._id)[0]
                      ?.quantity ? (
                      <AddButton
                        onClick={() =>
                          props.onOrderUpdate(
                            props.product?._id,
                            -1,
                            sizable,
                            size._id
                          )
                        }
                      >
                        -
                      </AddButton>
                    ) : (
                      <DisabledAddButton>-</DisabledAddButton>
                    )}

                    <Span>
                      {props.order
                        .filter((e) => e.productId === props.product._id)[0]
                        ?.sizes.filter((s) => s.sizeId === size._id)[0]
                        ?.quantity
                        ? props.order
                            .filter((e) => e.productId === props.product._id)[0]
                            .sizes.filter((s) => s.sizeId === size._id)[0]
                            .quantity
                        : 0}
                    </Span>
                    <AddButton
                      onClick={() =>
                        props.onOrderUpdate(
                          props.product?._id,
                          +1,
                          sizable,
                          size._id
                        )
                      }
                    >
                      +
                    </AddButton>
                  </DialogProp>
                </div>
              ))}
            </div>
          ) : (
            <DialogProp>
              {singleQuantity === 0 ? (
                <DisabledAddButton>-</DisabledAddButton>
              ) : (
                <AddButton
                  onClick={() =>
                    props.onOrderUpdate(props.product?._id, -1, sizable)
                  }
                >
                  -
                </AddButton>
              )}

              <Span>{singleQuantity}</Span>
              <AddButton
                onClick={() =>
                  props.onOrderUpdate(props.product?._id, +1, sizable)
                }
              >
                +
              </AddButton>
            </DialogProp>
          )}
        </AlertBox>
      </DialogContent>
    </>
  );
};

export default Counter;
