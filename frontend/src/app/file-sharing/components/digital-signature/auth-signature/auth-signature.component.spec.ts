import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSignatureComponent } from './auth-signature.component';

describe('AuthSignatureComponent', () => {
  let component: AuthSignatureComponent;
  let fixture: ComponentFixture<AuthSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
