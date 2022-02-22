export interface customOrderType {
  customorder: {
    value: [
      {
        productId: string;
        quantity: number;
        sizes: [{ sizeId: string; quantity: number }];
      }
    ];
  };
}
