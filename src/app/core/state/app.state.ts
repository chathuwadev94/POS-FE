import { IUserState } from "./user/user.reducer";

export interface IAppState {
  userState: IUserState;
}