import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureOtpComponent } from './signature-otp.component';

describe('SignatureOtpComponent', () => {
  let component: SignatureOtpComponent;
  let fixture: ComponentFixture<SignatureOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
