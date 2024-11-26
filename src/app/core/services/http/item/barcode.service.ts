import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { IBarcode, ICreateBarcodeDto } from '../../../interfaces/item/item-response.interface';
import { Observable, take } from 'rxjs';
import { IPagination } from '../../../interfaces/pagination/page.interface';

const BARCODE_URL = environment.services.barcode
@Injectable({
  providedIn: 'root'
})
export class BarcodeService extends BaseService {

  constructor(protected override http: HttpClient) {
    super(http, BARCODE_URL);
  }

  // create 
  create(createDto: ICreateBarcodeDto): Observable<IBarcode | any> {
    return this.post(createDto).pipe(take(1));
  }

  // update 
  public update(id: number, updateDto: ICreateBarcodeDto): Observable<IBarcode> {
    return this.http.put<IBarcode>(`${BARCODE_URL}/${id}`, updateDto).pipe(take(1));
  }

  // get  by id
  public getById(id: number): Observable<IBarcode> {
    return this.getOne(id).pipe(take(1));
  }

  // get  list
  public getListWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${BARCODE_URL}`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // get  list by name
  public getListByCodeWithPaginate(params?: HttpParams | any): Observable<any> {
    return this.http.get<IPagination>(`${BARCODE_URL}/search`, { params: { upcoming: 1, ...params } }).pipe(take(1));
  }

  // get  list 
  public getList(): Observable<any> {
    return this.http.get<IPagination>(`${BARCODE_URL}/findAll`).pipe(take(1));
  }

}
