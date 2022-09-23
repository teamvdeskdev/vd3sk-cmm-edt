import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLeftSidenavComponent } from './activity-left-sidenav.component';

describe('ActivityLeftSidenavComponent', () => {
  let component: ActivityLeftSidenavComponent;
  let fixture: ComponentFixture<ActivityLeftSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLeftSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLeftSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
