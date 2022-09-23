import { TestBed } from '@angular/core/testing';

import { ActivityDataFormatService } from './activity-data-format.service';

describe('ActivityDataFormatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityDataFormatService = TestBed.get(ActivityDataFormatService);
    expect(service).toBeTruthy();
  });
});
