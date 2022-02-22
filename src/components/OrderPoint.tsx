import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomConfigurator from "./commons/CustomConfigurator";
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
  Price,
} from "./styles/Menu.styled";
import { Flex } from "./styles/Flex.style";
import {
  Button,
  AddButton,
  EditButton,
  EditButtonOrdered,
} from "./styles/Button.styled";

function OrderPoint() {
  //const [order, orderSet] = useState<orderType>([]);
  const [dialog, dialogSet] = useState<
    menuType["menu"]["value"][0]["options"][0] | null
  >(null);
  const [create, createSet] = useState<menuType["menu"]["value"][0] | null>(
    null
  );

  //Redux
  const menu = useSelector((state: menuType) => state.menu.value);
  const order = useSelector((state: orderType) => state.order.value);
  const dispatch = useDispatch();

  const handleOrderUpdate = (
    id: string,
    variation: number,
    sizable: boolean,
    sizeId: string = ""
  ) => {
    let newOrder: orderType["order"]["value"] = JSON.parse(
      JSON.stringify(order)
    );

    //Updating quantity unsizeable product
    const product = newOrder.filter((p) => p.productId === id)[0];
    if (product) {
      if (!sizable) {
        product.quantity += variation;
      } else {
        product.quantity += variation;
        const size = product.sizes.filter((s) => s.sizeId === sizeId)[0];
        if (size) {
          size.quantity += variation;
        } else {
          product.sizes.push({ sizeId: sizeId, quantity: variation });
        }
      }
    }
    //Adding new product
    else {
      if (!sizable) {
        newOrder.push({
          productId: id,
          quantity: variation,
          sizes: [{ sizeId: "unsizeable", quantity: 0 }],
        });
      } else {
        newOrder.push({
          productId: id,
          quantity: 1,
          sizes: [{ sizeId: sizeId, quantity: variation }],
        });
      }
    }
    //Updating quantity sizeable product

    dispatch(loadOrder(newOrder));
  };

  const getButtonValue = (id: string) => {
    const quantity = order.filter((p) => p.productId === id)[0]?.quantity;
    if (quantity > 0) return quantity.toString();
    else return "+";
  };

  const getPrice = (oprion: menuType["menu"]["value"][0]["options"][0]) => {
    if (oprion.price > 0) return oprion.price + " €";
    if (oprion.sizes.length > 0) return "";
    if (oprion.price === 0) return "Free";
  };

  return (
    <>
      {create ? (
        <CustomConfigurator product={create}></CustomConfigurator>
      ) : (
        <>
          {dialog ? (
            <Counter
              product={dialog}
              order={order}
              onClose={() => dialogSet(null)}
              onOrderUpdate={(
                id: string,
                variation: number,
                sizable: boolean,
                sizeId: string = ""
              ) => handleOrderUpdate(id, variation, sizable, sizeId)}
            ></Counter>
          ) : null}

          <div className="page-container">
            <Menu>
              {menu.map((element) => (
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
                          <Button onClick={() => createSet(element)}>
                            CREA
                          </Button>
                        </Flex>
                      </SectionTitle>
                      <div>
                        {element.options.map((option) => (
                          <Element key={option._id}>
                            <Flex>
                              <div>
                                <Flex>
                                  <Product>{option.name}</Product>
                                  <Price>
                                    {option.price && !option.sizes.length
                                      ? option.price + " €"
                                      : "Free"}
                                  </Price>
                                </Flex>
                                <Details>{option.details}</Details>
                              </div>
                              <EditButton onClick={() => dialogSet(option)}>
                                {getButtonValue(option._id)}
                              </EditButton>
                            </Flex>
                          </Element>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <SectionTitle>
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
                      </SectionTitle>
                      <div>
                        {element.options.map((option) => (
                          <Element key={option._id}>
                            <Flex>
                              <div>
                                <Flex>
                                  <Product>{option.name}</Product>
                                  <Price>{getPrice(option)}</Price>
                                </Flex>
                                <Details>{option.details}</Details>
                              </div>
                              <EditButton onClick={() => dialogSet(option)}>
                                {getButtonValue(option._id)}
                              </EditButton>
                            </Flex>
                          </Element>
                        ))}
                      </div>
                    </>
                  )}
                </Section>
              ))}
            </Menu>
          </div>
        </>
      )}
    </>
  );
}

export default OrderPoint;
