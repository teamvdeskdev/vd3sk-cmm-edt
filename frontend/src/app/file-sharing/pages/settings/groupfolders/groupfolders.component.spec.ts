import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupfoldersComponent } from './groupfolders.component';

describe('GroupfoldersComponent', () => {
  let component: GroupfoldersComponent;
  let fixture: ComponentFixture<GroupfoldersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupfoldersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupfoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
