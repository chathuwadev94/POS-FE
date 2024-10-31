export interface ILoginDto {
    userName: string;
    password: string;
}

export interface ISignUpDto {
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
    phoneNumber?: number;
}

export interface IChangeRoleDto {
    role: string[]
}

export interface IChangeStatusDto {
    status: number;
}