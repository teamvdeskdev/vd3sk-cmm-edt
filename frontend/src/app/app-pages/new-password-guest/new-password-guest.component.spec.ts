import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordGuestComponent } from './new-password-guest.component';

describe('NewPasswordGuestComponent', () => {
  let component: NewPasswordGuestComponent;
  let fixture: ComponentFixture<NewPasswordGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPasswordGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
