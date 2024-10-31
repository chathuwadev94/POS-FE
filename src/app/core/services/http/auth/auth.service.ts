import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment.development';
import { IChangeRoleDto, IChangeStatusDto, ILoginDto, ISignUpDto } from '../../../interfaces/auth/auth.dto';
import { IUser } from '../../../interfaces/user/user.interface';

const AUTH_URL = environment.services.auth;
const USER_URL = environment.services.user;

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  constructor(protected override http: HttpClient) {
    super(http, AUTH_URL);
  }

  // login From BE
  singIn(loginDto: ILoginDto): Observable<any> {
    return this.http.post(`${AUTH_URL}/login`, loginDto).pipe(take(1));
  }

  // signup
  signUp(signUpDto: ISignUpDto): Observable<any> {
    return this.http.post(`${USER_URL}`, signUpDto).pipe(take(1));
  }

  //change role
  changeRole(id: number, updateDto: IChangeRoleDto): Observable<IUser> {
    return this.http.patch(`${AUTH_URL}/${id}/change-role`, updateDto).pipe(take(1));
  }

  //change status
  changeStatus(id: number, updateDto: IChangeStatusDto): Observable<IUser> {
    return this.http.patch(`${AUTH_URL}/${id}/change-status`, updateDto).pipe(take(1));
  }

  //reset password
  resetPassword(id: number): Observable<IUser> {
    return this.http.patch(`${AUTH_URL}/${id}/reset-password`, {}).pipe(take(1));
  }


}