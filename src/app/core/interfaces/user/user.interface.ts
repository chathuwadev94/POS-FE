export interface IUser {
    id?: number
    firstName?: string;
    lastName?: string;
    nic?: string;
    role?: string[];
    gender?: string;
    email?: string;
    address?: string;
    userName?: string;
    password?: string;
    status?: number;
    contacts?: IContacts[];
    showroom?:IShowroom
}


export interface IContacts {
    phoneNumber: string;
}


export interface IShowroom  {
    name?: string;
    address?: string;
    warehouseId?: number;
    location?: string;
    users?: IUser[];
}