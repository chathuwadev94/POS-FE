import { IItem } from "../item/item-response.interface";
import { IWarehouse } from "../warehouse/warehouse.interface";

export interface IStock {
    id: number;
    qty: number;
    warehouseId: number;
    itemId: number;
    status: number;
    warehouse?: IWarehouse;
    item: IItem;
    unitPrice: number;
}

export interface ICreateStockDto {
    qty?: number;
    itemId?: number;
    warehouseId?: number;
    capacity?: number;
    unitPrice?: number;
}