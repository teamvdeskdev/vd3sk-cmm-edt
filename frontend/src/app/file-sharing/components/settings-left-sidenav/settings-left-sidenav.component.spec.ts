import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLeftSidenavComponent } from './settings-left-sidenav.component';

describe('SettingsLeftSidenavComponent', () => {
  let component: SettingsLeftSidenavComponent;
  let fixture: ComponentFixture<SettingsLeftSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsLeftSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLeftSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
