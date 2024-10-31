export interface ILoginResponse {
    id?: number;
    firstName?: string;
    lastName?: string;
    nic?: string;
    role: string[];
    gender?: string;
    email?: string;
    address?: string;
    userName?: string;
    status?: number,
    accessToken?: string;
    refreshToken?: string;
    isLoggedIn?:boolean;
}