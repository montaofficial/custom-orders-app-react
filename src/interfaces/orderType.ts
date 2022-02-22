interface orderSize {
  sizeId: string;
  quantity: number;
}

export interface orderType {
  order: {
    value: Array<{
      productId: string;
      quantity: number;
      sizes: Array<orderSize>;
    }>;
  };
}
