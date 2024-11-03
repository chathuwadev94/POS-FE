export interface ISaleItemList {
    itemId: number;
    qty: number;
    stockId: number;
}

export interface IItemSale {
    itemCount: number;
    saleItemList: ISaleItemList[];
}