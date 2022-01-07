import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { IconPickerItem } from "react-fa-icon-picker";

function OptionsList(props: any) {
  const { options, order } = props;
  const [menu, setMenu] = useState([]);

  return (
    <div className="element-container">
      {options.map((option: any) => (
        <div
          onClick={() => props.onOrderEdit(option._id)}
          className="option-title row"
          key={option._id}
        >
          {order.includes(option._id) ? (
            <IconPickerItem size={16} color="white" icon="FaCheckSquare" />
          ) : (
            <IconPickerItem size={16} color="white" icon="FaSquare" />
          )}
          <div className="pl-2">{option.name}</div>
        </div>
      ))}
    </div>
  );
}

export default OptionsList;
