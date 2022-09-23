import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupfolderDeletedialogComponent } from './groupfolder-deletedialog.component';

describe('GroupfolderDeletedialogComponent', () => {
  let component: GroupfolderDeletedialogComponent;
  let fixture: ComponentFixture<GroupfolderDeletedialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupfolderDeletedialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupfolderDeletedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
