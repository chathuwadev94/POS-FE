import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export const responseBodyFormatInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(res => {
      if (res instanceof HttpResponse && res.body) {
        const body = res.body as { data: any };
        return res.clone({ body: body.data });
      }
      return res;
    })
  );;
};
