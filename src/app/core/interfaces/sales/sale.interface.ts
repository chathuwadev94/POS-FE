import { IItem } from "../item/item-response.interface";
import { IUser } from "../user/user.interface";


export interface ISale  {
    date?: Date;
    totalAmount?: number;
    itemCount?: number;
    user?: IUser
    saleItems?: ISaleItem[];
} 

export interface ISaleItemList {
    itemId: number;
    qty: number;
    stockId: number;
}

export interface IItemSale {
    itemCount: number;
    saleItemsList: ISaleItemList[];
    payment:number;
}

export interface ISaleItem  {
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
    sale?: ISale
    item?: IItem
    itemId?:number
}


export interface ISaleItemsResponse {
    id:number
    netAmount: number;
    itemsCount:number;
    totalQty:number;
    saleItems: ISaleItem[];
    date:Date;
    paymentMethod:string;
    payment:number;
}