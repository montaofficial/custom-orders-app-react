import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { load } from "../../features/menu";
import menuType from "../../interfaces/menuType";
import { IconPickerItem } from "react-fa-icon-picker";
import Counter from "./../commons/Counter";

function OrderPoint() {
  const [order, orderSet] = useState([]);
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

  const handleOrderUpdate = () => {
    console.log("HEY");
  };

  return (
    <>
      {dialog ? (
        <Counter
          order={order}
          onOrderUpdate={() => handleOrderUpdate()}
          onClose={() => dialogSet(null)}
        ></Counter>
      ) : null}

      <div className="page-container">
        {menu.map((element) => (
          <div className="menu-section rounded mt-3" key={element._id}>
            <div className="section-title row justify-content-start mt-2">
              <div className="center-vertical ml-2 nopadding">
                <IconPickerItem icon={element.icon} size={35} color={"white"} />
              </div>
              <div className="col-auto">{element.name}</div>
            </div>
            {element.editable ? (
              <div>
                <button
                  type="button"
                  className="btn btn-warning select-product-button"
                >
                  Crea {element.name}
                </button>
              </div>
            ) : (
              <div className="">
                {element.options.map((option) => (
                  <div key={option._id} className="menu-section-element">
                    <div className="row justify-content-between mt-2">
                      <div className="pl-4 col">
                        <div className="row justify-content-between">
                          <div className="col-auto product-name">
                            {option.name}
                          </div>
                          <div className="col-auto">{option.price} €</div>
                        </div>
                        <div className="product-details">{option.details}</div>
                      </div>

                      <div className="col-auto mr-4">
                        <button
                          onClick={() => dialogSet(option)}
                          type="button"
                          className="btn btn-warning select-product-button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default OrderPoint;
