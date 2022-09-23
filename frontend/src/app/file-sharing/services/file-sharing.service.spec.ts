import { TestBed } from '@angular/core/testing';

import { FileSharingService } from './file-sharing.service';

describe('FileSharingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileSharingService = TestBed.get(FileSharingService);
    expect(service).toBeTruthy();
  });
});
