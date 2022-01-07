import OptionsList from "./OptionsList";
import { IconPickerItem } from "react-fa-icon-picker";

function Product(props: any) {
  const { section, order } = props;

  return (
    <div className="element-container menu-container">
      <div key={section._id}>
        <div className="row justify-content-start">
          <div className="col-auto center-vertical">
            <IconPickerItem size={35} color="white" icon={section.icon} />
          </div>
          <div className="col-auto nopadding">
            <h1 className="section-title center-vertical nopadding">
              {section.name}
            </h1>
          </div>
        </div>

        {/*Rendering Editable products*/}
        {section.ingredients.length ? (
          <div>
            {section.ingredients.map((ingredient: any) => (
              <div key={ingredient._id}>
                <div className="ingredient-title">{ingredient.name}</div>
                <div>
                  <OptionsList
                    onOrderEdit={(prod: any) => props.onOrderEdit(prod)}
                    order={order}
                    options={ingredient.options}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {/*Rendering Standart products*/}
        {section.options.length ? (
          <OptionsList
            onOrderEdit={(prod: any) => props.onOrderEdit(prod)}
            order={order}
            options={section.options}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Product;
