import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { load } from "../features/menu";
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
} from "./styles/Menu.styled";
import { Flex } from "./styles/Flex.style";
import { Button, AddButton } from "./styles/Button.styled";

function OrderPoint() {
  const [order, orderSet] = useState<orderType>([
    { productId: "6195352e78598bb34a6df792", quantity: 1 },
  ]);
  const [dialog, dialogSet] = useState<
    menuType["menu"]["value"][0]["options"][0] | null
  >(null);

  const dispatch = useDispatch();

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

  const menu = useSelector((state: menuType) => state.menu.value);
  console.log(menu);

  const handleOrderUpdate = (id: string | undefined, variation: number) => {
    if (order.filter((p) => p.productId === id).length > 0) {
      const productIndex = order.findIndex((p) => p.productId === id);
    }
  };

  const getButtonValue = (id: string) => {
    const quantity = order.filter((p) => p.productId === id).length;
    if (quantity > 0) return quantity;
    else return "+";
  };

  return (
    <>
      {dialog ? (
        <Counter
          product={dialog}
          order={order}
          onClose={() => dialogSet(null)}
          onOrderUpdate={(id: string | undefined, variation: number) =>
            handleOrderUpdate(id, variation)
          }
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
                      <Button>CREA</Button>
                    </Flex>
                  </SectionTitle>
                  <div>
                    {element.options?.map((option) => (
                      <Element>
                        <div key={option._id}>
                          <div className="row justify-content-between mt-2">
                            <div className="pl-4 col">
                              <div className="row justify-content-between">
                                <Product>{option.name}</Product>
                                <div className="col-auto">{option.price} €</div>
                              </div>
                              <div className="product-details">
                                {option.details}
                              </div>
                            </div>

                            <div className="col-auto mr-4">
                              <AddButton onClick={() => dialogSet(option)}>
                                {getButtonValue(option._id)}
                              </AddButton>
                            </div>
                          </div>
                        </div>
                      </Element>
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
                    {element.options.map((option) => (
                      <Element>
                        <div key={option._id}>
                          <div className="row justify-content-between mt-2">
                            <div className="pl-4 col">
                              <div className="row justify-content-between">
                                <Product>{option.name}</Product>
                                <div className="col-auto">{option.price} €</div>
                              </div>
                              <Details>{option.details}</Details>
                            </div>

                            <div className="col-auto mr-4">
                              <AddButton onClick={() => dialogSet(option)}>
                                {getButtonValue(option._id)}
                              </AddButton>
                            </div>
                          </div>
                        </div>
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
  );
}

export default OrderPoint;
