import { getState, patchState, signalStore, withHooks, withMethods, withState, } from "@ngrx/signals";
import { IUser } from "../interfaces/user/user.interface";
import { effect } from "@angular/core";

const userKey = 'userKey'
type UserState = {
    user: IUser
    showroom: string;
}

const initialUserState: UserState = {
    user: { firstName: '' },
    showroom: ''
}

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialUserState),
    withMethods((store) => ({
        setUser(user: IUser) {
            patchState(store, {
                user,
                showroom: user.showroom?.name
            })
        }
    })),
    withHooks({
        onInit(store) {
            const temp = JSON.parse(localStorage.getItem(userKey) || '{}')
            patchState(store, temp)
            effect(() => {
                const userState = getState(store);
                localStorage.setItem(userKey, JSON.stringify(userState))
            })
        },
    })
);