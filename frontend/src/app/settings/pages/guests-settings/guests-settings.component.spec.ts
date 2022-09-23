import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestsSettingsComponent } from './guests-settings.component';

describe('GuestsSettingsComponent', () => {
  let component: GuestsSettingsComponent;
  let fixture: ComponentFixture<GuestsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
