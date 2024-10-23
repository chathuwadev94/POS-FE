import { TestBed } from '@angular/core/testing';

import { CookieManageService } from './cookie-manage.service';

describe('CookieManageService', () => {
  let service: CookieManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
