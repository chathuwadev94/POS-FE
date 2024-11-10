import { IStock } from "../item/item-response.interface";

export interface IWarehouse {
    id: number;
    name: string;
    location: string;
    address: string;
    capacity: number;
    stocks: IStock[];

}