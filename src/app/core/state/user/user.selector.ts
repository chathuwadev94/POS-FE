import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IUserState } from "./user.reducer";



export const selectUserFeature = createFeatureSelector<IUserState>('userState');

export const selectLoggedInUser = createSelector(
  selectUserFeature,
  (state: IUserState) => state.user
);