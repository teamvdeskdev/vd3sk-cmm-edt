import { TestBed } from '@angular/core/testing';

import { VshareSettingsService } from './vshare-settings.service';

describe('VshareSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VshareSettingsService = TestBed.get(VshareSettingsService);
    expect(service).toBeTruthy();
  });
});
