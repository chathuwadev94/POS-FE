import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.apiBaseUrl
  if (req.url.startsWith(baseUrl)) {
    return next(req);
  }
  const apiReq = req.clone({
    url: `${baseUrl}${req.url}`,
  });
  return next(apiReq);
};
