import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(protected http: HttpClient, @Inject(String) protected url: string) { }

  public get<T>(params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.url, { params }).pipe(take(1));
  } // get

  public getOne<T>(id: number, params?: HttpParams): Observable<T | any> {
    return this.http.get<T>(`${this.url}/${id}`, { params }).pipe(take(1));
  } // getOne

  public post<T>(body: any, params?: HttpParams): Observable<T | any> {
    delete body.id;
    return this.http.post<T>(this.url, body, { params }).pipe(take(1));
  } // post

  public put<T>(body: any, params?: HttpParams): Observable<T | any> {
    const id = body.id;
    delete body.id;
    return this.http
      .put<T>(`${this.url}/${id}`, body, { params })
      .pipe(take(1));
  } // put

  public delete<T>(id: string, params?: HttpParams): Observable<T | any> {
    return this.http.delete<T>(`${this.url}/${id}`, { params }).pipe(take(1));
  } // delete

  public patch<T>(body: any, params?: HttpParams): Observable<T | any> {
    return this.http.patch<T>(`${this.url}`, body, { params }).pipe(take(1));
  }
}
