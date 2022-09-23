import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupfolderTableComponent } from './groupfolder-table.component';

describe('GroupfolderTableComponent', () => {
  let component: GroupfolderTableComponent;
  let fixture: ComponentFixture<GroupfolderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupfolderTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupfolderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
