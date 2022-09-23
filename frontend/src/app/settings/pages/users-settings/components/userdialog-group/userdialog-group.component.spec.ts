import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdialogGroupComponent } from './userdialog-group.component';

describe('UserdialogGroupComponent', () => {
  let component: UserdialogGroupComponent;
  let fixture: ComponentFixture<UserdialogGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserdialogGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdialogGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
