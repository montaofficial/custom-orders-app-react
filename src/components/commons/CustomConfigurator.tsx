import { useSelector } from "react-redux";
import menuType from "../../interfaces/menuType";
import {
  Element,
  Product,
  Details,
  Menu,
  Section,
  Price,
  SectionHeader,
} from "../styles/Menu.styled";
import { EditButton } from "../styles/Button.styled";
import { IconPickerItem } from "react-fa-icon-picker";
import { SectionTitle, IngredintSectionTitle } from "./../styles/Menu.styled";
import { Flex } from "./../styles/Flex.style";
import { Button } from "./../styles/Button.styled";

interface Props {
  product: menuType["menu"]["value"][0];
}

const getPrice = (oprion: menuType["menu"]["value"][0]["options"][0]) => {
  if (oprion.price > 0) return oprion.price + " €";
  if (oprion.sizes.length > 0) return "";
  if (oprion.price === 0) return "Free";
};

export const CustomConfigurator: React.FC<Props> = (props) => {
  const menu = useSelector((state: menuType) => state.menu.value);

  const element = props.product;
  return (
    <div className="page-container">
      <Menu>
        <Section>
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
                <div className="col-auto">Crea {element.name}</div>
              </div>
              <Button>ORDINA</Button>
            </Flex>
          </SectionTitle>
        </Section>
        {element.ingredients.map((ingredient) => (
          <div key={ingredient._id}>
            <Section>
              <SectionHeader>
                <IngredintSectionTitle>{ingredient.name}</IngredintSectionTitle>
                {ingredient.single ? "(Scelta Singola)" : ""}
              </SectionHeader>
              {ingredient.options.map((option) => (
                <Element key={option._id}>
                  <Flex>
                    <div>
                      <Flex>
                        <Product>{option.name}</Product>
                        <Price>{getPrice(option)}</Price>
                      </Flex>
                      <Details>{option.details}</Details>
                    </div>
                    <EditButton>+</EditButton>
                  </Flex>
                </Element>
              ))}
            </Section>
          </div>
        ))}
      </Menu>
    </div>
  );
};

export default CustomConfigurator;
