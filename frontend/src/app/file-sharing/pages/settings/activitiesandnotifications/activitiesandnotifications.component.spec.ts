import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesandnotificationsComponent } from './activitiesandnotifications.component';

describe('ActivitiesandnotificationsComponent', () => {
  let component: ActivitiesandnotificationsComponent;
  let fixture: ComponentFixture<ActivitiesandnotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesandnotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesandnotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
