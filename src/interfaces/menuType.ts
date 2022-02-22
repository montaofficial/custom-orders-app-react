import { IconList } from "react-fa-icon-picker";

interface option {
  _id: string;
  name: string;
  price: number;
  details: string;
  allergens: [string];
  sizable: boolean;
  sizes: [
    {
      _id: string;
      name: string;
      measure: string;
      price: number;
    }
  ];
}

interface ingredient {
  _id: string;
  name: string;
  single: boolean;
  mandatory: boolean;
  max: number;
  options: Array<option>;
}

export default interface menuType {
  menu: {
    value: [
      {
        _id: string;
        name: string;
        t: string;
        icon: IconList;
        editable: boolean;
        ingredients: Array<ingredient>;
        options: Array<option>;
      }
    ];
  };
}
