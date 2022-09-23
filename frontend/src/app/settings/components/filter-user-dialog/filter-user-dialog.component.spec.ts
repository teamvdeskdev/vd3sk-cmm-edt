import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterUserDialogComponent } from './filter-user-dialog.component';

describe('FilterUserDialogComponent', () => {
  let component: FilterUserDialogComponent;
  let fixture: ComponentFixture<FilterUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
