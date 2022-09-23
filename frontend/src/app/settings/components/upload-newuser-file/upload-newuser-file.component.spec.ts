import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNewuserFileComponent } from './upload-newuser-file.component';

describe('UploadNewuserFileComponent', () => {
  let component: UploadNewuserFileComponent;
  let fixture: ComponentFixture<UploadNewuserFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadNewuserFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadNewuserFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
