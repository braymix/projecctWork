import { TestBed } from '@angular/core/testing';

import { IsAutenticatedService } from './is-autenticated.service';

describe('IsAutenticatedService', () => {
  let service: IsAutenticatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsAutenticatedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
