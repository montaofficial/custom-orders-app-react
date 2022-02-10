import { IconList } from "react-fa-icon-picker";

export default interface menuType {
  menu: {
    value: [
      {
        _id: string;
        name: string;
        t: string;
        icon: IconList;
        editable: boolean;
        ingredients: [
          {
            _id: string;
            name: string;
            single: boolean;
            mandatory: boolean;
            options: [
              {
                _id: string;
                name: string;
                price: number;
                details: string;
                sizes: [
                  {
                    _id: string;
                    name: string;
                    measure: string;
                    price: number;
                  }
                ];
              }
            ];
          }
        ];
        options: [
          {
            _id: string;
            name: string;
            price: number;
            details: string;
            sizes: [
              {
                _id: string;
                name: string;
                measure: string;
                price: number;
              }
            ];
          }
        ];
      }
    ];
  };
}
