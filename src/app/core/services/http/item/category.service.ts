import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ICategory, ICreateCategoryDto } from '../../../interfaces/item/item-response.interface';
import { Observable, take } from 'rxjs';
import { IPagination } from '../../../interfaces/pagination/page.interface';

const CATEGORY_URL = environment.services.category;
@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  constructor(protected override http: HttpClient) {
    super(http, CATEGORY_URL);
  }

  // create 
  create(createDto: ICreateCategoryDto): Observable<ICategory | any> {
    return this.post(createDto).pipe(take(1));
  }

  // update 
  public update(id: number, updateDto: ICreateCategoryDto): Observable<ICategory> {
    return this.http.put<ICategory>(`${CATEGORY_URL}/${id}`, updateDto).pipe(take(1));
  }

  // get  by id
  public getById(id: number): Observable<ICategory> {
    return this.getOne(id).pipe(take(1));
  }

  // get  list
  public getListWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${CATEGORY_URL}`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // get  list by name
  public getListByNameWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${CATEGORY_URL}/search-name`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // get  list 
  public getList(): Observable<any> {
    return this.http.get<IPagination>(`${CATEGORY_URL}/findAll`).pipe(take(1));
  }

}
