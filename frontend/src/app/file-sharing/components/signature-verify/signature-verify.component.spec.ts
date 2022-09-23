import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureVerifyComponent } from './signature-verify.component';

describe('SignatureVerifyComponent', () => {
  let component: SignatureVerifyComponent;
  let fixture: ComponentFixture<SignatureVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
