import OptionsList from "./OptionsList";
import { IconPickerItem } from "react-fa-icon-picker";

function Product(props: any) {
  const { section } = props;
  console.log(section);

  return (
    <div className="element-container">
      <div key={section._id}>
        <div className="row justify-content-start">
          <div className="col-auto">
            <IconPickerItem color="white" icon={section.icon} />{" "}
          </div>
          <div className="col-auto">
            <h1 className="section-title">{section.name}</h1>
          </div>
        </div>

        {/*Rendering Editable products*/}
        {section.ingredients.length ? (
          <div>
            {section.ingredients.map((ingredient: any) => (
              <div key={ingredient._id}>
                <div className="ingredient-title">{ingredient.name}</div>
                <div>
                  <OptionsList options={ingredient.options} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {/*Rendering Standart products*/}
        {section.options.length ? (
          <OptionsList options={section.options} />
        ) : null}
      </div>
    </div>
  );
}

export default Product;
