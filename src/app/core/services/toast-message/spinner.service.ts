import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  visible$ = new Subject<boolean>();
  visible = this.visible$.asObservable()

  constructor() { }

  showSpinner(show: boolean): void {
    this.visible$.next(show);
  }
}
