import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export const responseBodyFormatInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(res => {
      if (res instanceof HttpResponse) {
        return res.clone({ body: res.body });
      }
      return res;
    })
  );;
};
