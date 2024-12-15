import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Observable, take } from 'rxjs';
import { ISaleItemDetails } from '../../../interfaces/item/item-response.interface';
import { ICreateStockDto, IStock } from '../../../interfaces/stock/stock.interface';
import { IPagination } from '../../../interfaces/pagination/page.interface';

const STOCK_URL = environment.services.stock
@Injectable({
  providedIn: 'root'
})

export class StockService extends BaseService {

  constructor(protected override http: HttpClient) {
    super(http, STOCK_URL);
  }

    // create Stock
    create(createDto: ICreateStockDto): Observable<IStock | any> {
      return this.post(createDto).pipe(take(1));
    }
  
    // update Stock
    public update(id: number, updateDto: ICreateStockDto): Observable<IStock> {
      return this.http.put<IStock>(`${STOCK_URL}/${id}`, updateDto).pipe(take(1));
    }
  
    // get Stock by id
    public getById(id: number): Observable<IStock> {
      return this.getOne(id).pipe(take(1));
    }
    // get Stock list with pagination
    public getStockListWithPaginate(params?: HttpParams | any): Observable<any> {
      return this.http.get<IPagination>(`${STOCK_URL}`, { params: { upcoming: 1, ...params } }).pipe(take(1));
    }


  public getStockItemByBarcodea(params?: HttpParams | any): Observable<IStock> {
    return this.http.get<any>(`${STOCK_URL}/warehouse-item`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  public incrementItemCount(params?: HttpParams | any): Observable<ISaleItemDetails> {
    return this.http.get<any>(`${STOCK_URL}/item-qty-increment`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

}
