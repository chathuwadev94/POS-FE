import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { IPagination } from '../../../interfaces/pagination/page.interface';
import { ICreateItemDto, IItem } from '../../../interfaces/item/item-response.interface';

const ITEM_URL = environment.services.item
@Injectable({
  providedIn: 'root'
})
export class ItemService extends BaseService {

  constructor(private readonly httpClient: HttpClient) {
    super(httpClient, ITEM_URL);
  }

  // create 
  create(createDto: ICreateItemDto): Observable<IItem | any> {
    return this.post(createDto).pipe(take(1));
  }

  // update 
  public update(id: number, updateDto: ICreateItemDto): Observable<IItem> {
    return this.http.put<IItem>(`${ITEM_URL}/${id}`, updateDto).pipe(take(1));
  }

  // get  by id
  public getById(id: number): Observable<IItem> {
    return this.getOne(id).pipe(take(1));
  }

  // get  list
  public getListWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${ITEM_URL}`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // get  list by name
  public getListByNameWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${ITEM_URL}/search-by-name`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // get  list 
  public getList(): Observable<any> {
    return this.http.get<IPagination>(`${ITEM_URL}/findAll`).pipe(take(1));
  }

  // get item by barcode
  public getPaginatedItemByBcode(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${ITEM_URL}/search-by-barcode`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }
}
