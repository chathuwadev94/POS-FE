import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Observable, take } from 'rxjs';

const STOCK_URL = environment.services.stock
@Injectable({
  providedIn: 'root'
})

export class StockService extends BaseService {

  constructor(protected override http: HttpClient) {
    super(http, STOCK_URL);
  }

  public getStockItemByBarcodea(params?: HttpParams | any): Observable<any> {
    return this.http.get<any>(`${STOCK_URL}/warehouse-item`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

}
