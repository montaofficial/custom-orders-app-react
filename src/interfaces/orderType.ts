export interface orderElementType {
  productId: string;
  quantity: number;
}

export interface orderType extends Array<orderElementType> {}
