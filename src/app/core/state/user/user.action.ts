import { createAction, props } from '@ngrx/store'
import { ILoginDto } from '../../interfaces/auth/auth.dto';
import { IUser } from '../../interfaces/user/user.interface';

export const userSignIn = createAction('[User Component] userSignIn',
    props<{ loginDto: ILoginDto }>()
);

export const setLoggedInUser = createAction('[User Component] setLoggedInUser',
    props<{ user: IUser }>()
);