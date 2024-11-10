import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Observable, take } from 'rxjs';
import { IItemSale, ISaleItemsResponse } from '../../../interfaces/sales/sale.interface';

const SAlE_URL = environment.services.sale
@Injectable({
  providedIn: 'root'
})
export class SaleService extends BaseService {

  constructor(private readonly httpClient: HttpClient) {
    super(httpClient, SAlE_URL);
  }

  createSale(createSaleDto: IItemSale): Observable<ISaleItemsResponse | any> {
    return this.post(createSaleDto).pipe(take(1));
  }
}
