import { HttpInterceptorFn } from '@angular/common/http';

export const tokenAttachInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
