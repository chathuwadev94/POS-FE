import { createReducer, on } from '@ngrx/store';
import { IUser } from '../../interfaces/user/user.interface';
import * as userAction from './user.action';

export interface IUserState {
    user?: IUser;
}

export const userState: IUserState = {}

export const userReducer = createReducer(
    userState,
    on(userAction.setLoggedInUser, (state, { user }) => ({
        ...state,
        user
    }))
)