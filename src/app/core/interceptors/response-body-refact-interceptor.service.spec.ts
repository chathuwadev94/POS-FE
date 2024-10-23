import { TestBed } from '@angular/core/testing';

import { ResponseBodyRefactInterceptorService } from './response-body-refact-interceptor.service';

describe('ResponseBodyRefactInterceptorService', () => {
  let service: ResponseBodyRefactInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseBodyRefactInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
