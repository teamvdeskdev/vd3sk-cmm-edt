import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupfolderSidebarComponent } from './groupfolder-sidebar.component';

describe('GroupfolderSidebarComponent', () => {
  let component: GroupfolderSidebarComponent;
  let fixture: ComponentFixture<GroupfolderSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupfolderSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupfolderSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
