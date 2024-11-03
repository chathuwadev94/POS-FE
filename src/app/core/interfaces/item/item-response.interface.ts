import { IWarehouse } from "../warehouse/warehouse.interface";

export interface IItem {
    id: number;
    name: string;
    description?: string;
    cost?: number;
    image?: string;
    manufactur?: string;
    category?: ICategory
    barcode?: IBarcode;
    stock?: IStock
}

export interface ICategory {
    id: number;
    name: string;
    description: string;
    item: IItem[];
}

export interface IBarcode {
    id?: number;
    code?: string;
    type?: number;
    item?: IItem;
}

export interface IStock {
    id: number;
    qty?: number;
    warehouseId?: number;
    itemId: number;
    status?: number;
    warehouse?: IWarehouse;
    item: IItem;
    unitPrice: number;
}