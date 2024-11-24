export interface IUser {
    id?: number
    firstName?: string;
    lastName?: string;
    nic?: string;
    roles?: string[];
    gender?: string;
    email?: string;
    address?: string;
    userName?: string;
    password?: string;
    status?: number;
    contacts?: IContacts[];
    showroom?: IShowroom;
    showroomId?: number;
    phoneNumber?: string
}


export interface IContacts {
    phoneNumber: string;
}


export interface IShowroom {
    id?: number
    name?: string;
    address?: string;
    warehouseId?: number;
    location?: string;
    users?: IUser[];
    phoneNumber?: string;
}


export interface ICreateUserDto {
    firstName: string;
    lastName: string;
    nic?: string;
    gender: string;
    address: string;
    email: string;
    userName?: string;
    password?: string;
    showroomId: number;
    roles?: string[];
    status?: number;
    phoneNumber?: string
}