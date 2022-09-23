import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamluserSettingsComponent } from './samluser-settings.component';

describe('SamluserSettingsComponent', () => {
  let component: SamluserSettingsComponent;
  let fixture: ComponentFixture<SamluserSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamluserSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamluserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
