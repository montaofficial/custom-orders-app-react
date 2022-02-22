import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loadMenu } from "../features/menu";
import { loadOrder } from "../features/order";
import menuType from "../interfaces/menuType";
import { IconPickerItem } from "react-fa-icon-picker";
import Counter from "./commons/Counter";
import { orderType } from "../interfaces/orderType";
import {
  Menu,
  Element,
  Section,
  SectionTitle,
  Product,
  Details,
  ElementOrdered,
} from "./styles/Menu.styled";
import { Flex } from "./styles/Flex.style";
import {
  Button,
  AddButton,
  EditButton,
  EditButtonOrdered,
} from "./styles/Button.styled";

function OrderReview() {
  //const [order, orderSet] = useState<orderType>([]);
  const [dialog, dialogSet] = useState<
    menuType["menu"]["value"][0]["options"][0] | null
  >(null);

  //Redux
  const menu = useSelector((state: menuType) => state.menu.value);
  const order = useSelector((state: orderType) => state.order.value);
  const dispatch = useDispatch();

  //Creating order id array
  const orderProductsIds = order
    .filter((o) => o.quantity > 0)
    .map((o) => o.productId);

  const handleOrderUpdate = (id: string, variation: number) => {
    let newOrder: orderType["order"]["value"] = JSON.parse(
      JSON.stringify(order)
    );

    //Updating quantity
    if (newOrder.filter((p) => p.productId === id).length > 0) {
      const productIndex = newOrder.findIndex((p) => p.productId === id);
      newOrder[productIndex].quantity =
        newOrder[productIndex].quantity + variation;
    }
    //Adding new product
    else {
      newOrder.push({
        productId: id,
        quantity: variation,
        sizes: [{ sizeId: "unsizeable", quantity: 0 }],
      });
    }
    dispatch(loadOrder(newOrder));
  };

  const getButtonValue = (id: string) => {
    const quantity = order.filter((p) => p.productId === id)[0]?.quantity;
    if (quantity > 0) return quantity.toString();
    else return "+";
  };

  return (
    <>
      {dialog ? (
        <Counter
          product={dialog}
          order={order}
          onClose={() => dialogSet(null)}
          onOrderUpdate={(id: string, variation: number) =>
            handleOrderUpdate(id, variation)
          }
        ></Counter>
      ) : null}

      <div className="page-container">
        <Menu>
          {menu
            .filter(
              (e) =>
                e.options.filter((o) => orderProductsIds.includes(o._id))
                  .length > 0
            )
            .filter((e) =>
              e.options
                .map((o) => o._id)
                .filter((id) => orderProductsIds.includes(id))
            )
            .map((element) => (
              <Section key={element._id}>
                {element.editable ? (
                  <>
                    <SectionTitle>
                      <Flex>
                        <div className="section-title row justify-content-start mt-2">
                          <div className="center-vertical ml-2 nopadding">
                            <IconPickerItem
                              icon={element.icon}
                              size={35}
                              color={"white"}
                            />
                          </div>
                          <div className="col-auto">{element.name}</div>
                        </div>
                        <Button>CREA</Button>
                      </Flex>
                    </SectionTitle>
                    <div>
                      {element.options
                        .filter((o) => orderProductsIds.includes(o._id))
                        .map((option) => (
                          <div key={option._id}>
                            <Element>
                              <div className="row justify-content-between mt-2">
                                <div className="pl-4 col">
                                  <div className="row justify-content-between">
                                    <Product>{option.name}</Product>
                                    <div className="col-auto"></div>
                                  </div>
                                  <Details>{option.details}</Details>
                                </div>

                                <div className="col-auto mr-4">
                                  <EditButton onClick={() => dialogSet(option)}>
                                    {getButtonValue(option._id)}
                                  </EditButton>
                                </div>
                              </div>
                            </Element>
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="section-title row justify-content-start mt-2">
                      <div className="center-vertical ml-2 nopadding">
                        <IconPickerItem
                          icon={element.icon}
                          size={35}
                          color={"white"}
                        />
                      </div>
                      <div className="col-auto">{element.name}</div>
                    </div>
                    <div>
                      {element.options
                        .filter((o) => orderProductsIds.includes(o._id))
                        .map((option) => (
                          <div key={option._id}>
                            <Element>
                              <div className="row justify-content-between mt-2">
                                <div className="pl-4 col">
                                  <div className="row justify-content-between">
                                    <Product>{option.name}</Product>
                                    <div className="col-auto"></div>
                                  </div>
                                  <Details>{option.details}</Details>
                                </div>
                                <div className="col-auto mr-4">
                                  <EditButton onClick={() => dialogSet(option)}>
                                    {getButtonValue(option._id)}
                                  </EditButton>
                                </div>
                              </div>
                            </Element>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </Section>
            ))}
        </Menu>
      </div>
    </>
  );
}

export default OrderReview;
