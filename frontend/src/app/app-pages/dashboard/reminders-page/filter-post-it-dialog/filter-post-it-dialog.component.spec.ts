import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPostItDialogComponent } from './filter-post-it-dialog.component';

describe('FilterPostItDialogComponent', () => {
  let component: FilterPostItDialogComponent;
  let fixture: ComponentFixture<FilterPostItDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterPostItDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPostItDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
