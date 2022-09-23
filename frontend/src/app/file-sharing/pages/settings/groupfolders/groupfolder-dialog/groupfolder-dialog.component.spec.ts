import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupfolderDialogComponent } from './groupfolder-dialog.component';

describe('GroupfolderDialogComponent', () => {
  let component: GroupfolderDialogComponent;
  let fixture: ComponentFixture<GroupfolderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupfolderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupfolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
