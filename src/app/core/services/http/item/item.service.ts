import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { IPagination } from '../../../interfaces/pagination/page.interface';

const ITEM_URL = environment.services.item
@Injectable({
  providedIn: 'root'
})
export class ItemService extends BaseService {

  constructor(private readonly httpClient: HttpClient) {
    super(httpClient, ITEM_URL);
  }

    // get item by barcode
    public getPaginatedItemByBcode(params?: HttpParams | any): Observable<any> {
      return this.http.get<IPagination>(`${ITEM_URL}/search-by-barcode`, { params: { upcoming: 1, ...params } }).pipe(take(1));
    }
}
