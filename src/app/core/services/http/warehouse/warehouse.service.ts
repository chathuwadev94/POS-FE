import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Observable, take } from 'rxjs';
import { IPagination } from '../../../interfaces/pagination/page.interface';
import { ICreateWarehouseDto, IWarehouse } from '../../../interfaces/warehouse/warehouse.interface';

const WAREHOUSE_URL = environment.services.warehouse
@Injectable({
  providedIn: 'root'
})
export class WarehouseService extends BaseService {

  constructor(protected override http: HttpClient) {
    super(http, WAREHOUSE_URL);
  }

  // create warehouse
  create(warehouseDto: ICreateWarehouseDto): Observable<IWarehouse | any> {
    return this.post(warehouseDto).pipe(take(1));
  }

  // update warehouse
  public update(id: number, warehouseDto: ICreateWarehouseDto): Observable<IWarehouse> {
    return this.http.put<IWarehouse>(`${WAREHOUSE_URL}/${id}`, warehouseDto).pipe(take(1));
  }

  // get warehouse by id
  public getById(id: number): Observable<IWarehouse> {
    return this.getOne(id).pipe(take(1));
  }
  // get warehouse list with pagination
  public getWarehouseListWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${WAREHOUSE_URL}`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // get warehouse list by name
  public getWarehouseListByNameWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${WAREHOUSE_URL}/warehouse-search`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // get warehouse list 
  public getWarehouseList(): Observable<any> {
    return this.http.get<IPagination>(`${WAREHOUSE_URL}/findAll`).pipe(take(1));
  }

}
