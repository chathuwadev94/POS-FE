import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  private subject = new Subject<any>();
  constructor() { }

  addNotification(severity: string, message: string) {
    this.subject.next({ severity: severity, message: message })
  }

  getNotification(): Observable<any> {
    return this.subject.asObservable();
  }

}
