import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdialogPasswordComponent } from './userdialog-password.component';

describe('UserdialogPasswordComponent', () => {
  let component: UserdialogPasswordComponent;
  let fixture: ComponentFixture<UserdialogPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserdialogPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdialogPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
