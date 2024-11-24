import { IStock } from "../item/item-response.interface";
import { IUser } from "../user/user.interface";

export interface IWarehouse {
    id?: number;
    name?: string;
    location?: string;
    address?: string;
    capacity?: number;
    stocks?: IStock[];

}

export interface IShowroom {
    id?: number;
    name?: string;
    address?: string;
    warehouseId?: number;
    location?: string;
    warehouse?: IWarehouse;
    users?: IUser[];
}


export interface ICreateWarehouseDto {
    name: string;
    location: string;
    address: string;
    capacity: number;
}

export interface ICreateShowroom {
    name: string;
    address: string;
    warehouseId: number;
    location: string;
    phoneNumber: string;
}