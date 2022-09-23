import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBackupCodeComponent } from './login-backup-code.component';

describe('LoginBackupCodeComponent', () => {
  let component: LoginBackupCodeComponent;
  let fixture: ComponentFixture<LoginBackupCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginBackupCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBackupCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
