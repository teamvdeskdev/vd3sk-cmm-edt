import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VshareActivitiesTableComponent } from './vshare-activities-table.component';

describe('VshareActivitiesTableComponent', () => {
  let component: VshareActivitiesTableComponent;
  let fixture: ComponentFixture<VshareActivitiesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VshareActivitiesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VshareActivitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
