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

export interface ICreateItemDto {
    name?: string;
    description?: string;
    cost?: number;
    image?: string;
    categoryId?: number;
    manufactur?: string;
    barcodeId?: number;
}

export interface ICategory {
    id?: number;
    name?: string;
    description?: string;
    item?: IItem[];
}

export interface ICreateCategoryDto {
    name: string;
    description: string;
}

export interface IBarcode {
    id?: number;
    code?: string;
    type?: number;
    item?: IItem;
    typeName?: string;
}

export interface ICreateBarcodeDto {
    code?: string;
    type?: number;
    typeName?: string;
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

export interface ISaleItemDetails {
    itemId: number;
    qty: number;
    stockId: number;
    unitPrice: number;
}