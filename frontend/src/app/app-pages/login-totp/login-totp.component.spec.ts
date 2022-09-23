import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTotpComponent } from './login-totp.component';

describe('LoginTotpComponent', () => {
  let component: LoginTotpComponent;
  let fixture: ComponentFixture<LoginTotpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginTotpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginTotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
