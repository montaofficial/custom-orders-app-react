export default interface menuType {
  _id: string;
  store: string;
  active: number;
  name: string;
  saves: number;
  menu: [
    {
      _id: string;
      name: string;
      t: string;
      icon: string;
      editable: boolean;
      ingredients: [
        {
          _id: string;
          name: string;
          single: boolean;
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
}
