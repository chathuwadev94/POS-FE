import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IUser } from '../../../interfaces/user/user.interface';
import { Observable, take } from 'rxjs';
import { IPagination } from '../../../interfaces/pagination/page.interface';

const USER_URL = environment.services.user
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(protected override http: HttpClient) {
    super(http, USER_URL);
  }

  create(userDto: IUser): Observable<IUser | any> {
    return this.post(userDto).pipe(take(1));
  }

  // get user list
  public getUserListWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${USER_URL}`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // update user
  public update(id: number, userDto: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${USER_URL}/${id}`, userDto).pipe(take(1));
  }

  // get user by id
  public getUserById(id: number): Observable<IUser> {
    return this.getOne(id).pipe(take(1));
  }

  // user search by nic
  public searchUserByNic(params?: HttpParams | any): Observable<IPagination> {
    return this.http.get<IPagination>(`${USER_URL}/user-search`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

}
