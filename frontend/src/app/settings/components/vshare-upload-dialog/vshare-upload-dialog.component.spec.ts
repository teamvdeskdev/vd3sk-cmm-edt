import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VshareUploadDialogComponent } from './vshare-upload-dialog.component';

describe('VshareUploadDialogComponent', () => {
  let component: VshareUploadDialogComponent;
  let fixture: ComponentFixture<VshareUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VshareUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VshareUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
