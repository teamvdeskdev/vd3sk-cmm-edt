import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersActivitiesComponent } from './others-activities.component';

describe('OthersActivitiesComponent', () => {
  let component: OthersActivitiesComponent;
  let fixture: ComponentFixture<OthersActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
