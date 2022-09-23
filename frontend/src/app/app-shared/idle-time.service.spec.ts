import { TestBed } from '@angular/core/testing';

import { IdleTimeService } from './idle-time.service';

describe('IdleTimeService', () => {
  let service: IdleTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdleTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
