import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VshUploadDialogTableComponent } from './vsh-upload-dialog-table.component';

describe('VshUploadDialogTableComponent', () => {
  let component: VshUploadDialogTableComponent;
  let fixture: ComponentFixture<VshUploadDialogTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VshUploadDialogTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VshUploadDialogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
