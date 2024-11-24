import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../../../interfaces/pagination/page.interface';
import { Observable, take } from 'rxjs';
import { ICreateShowroom } from '../../../interfaces/warehouse/warehouse.interface';
import { IShowroom } from '../../../interfaces/user/user.interface';

const SHOW_ROOM_URL = environment.services.showroom
@Injectable({
  providedIn: 'root'
})
export class ShowroomService extends BaseService {

  constructor(protected override http: HttpClient) {
    super(http, SHOW_ROOM_URL);
  }

  // create showroom
  create(createDto: ICreateShowroom): Observable<IShowroom | any> {
    return this.post(createDto).pipe(take(1));
  }

  // update warehouse
  public update(id: number, updateDto: ICreateShowroom): Observable<IShowroom> {
    return this.http.put<IShowroom>(`${SHOW_ROOM_URL}/${id}`, updateDto).pipe(take(1));
  }

  // get warehouse by id
  public getById(id: number): Observable<IShowroom> {
    return this.getOne(id).pipe(take(1));
  }

  // get showroom list
  public getShowroomListWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${SHOW_ROOM_URL}`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // get showroom list by name
  public getShowroomListByNameWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${SHOW_ROOM_URL}/search-name`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // get showroom list 
  public getShowroomList(): Observable<any> {
    return this.http.get<IPagination>(`${SHOW_ROOM_URL}/findAll`).pipe(take(1));
  }
}
