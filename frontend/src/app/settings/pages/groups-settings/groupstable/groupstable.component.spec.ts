import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupstableComponent } from './groupstable.component';

describe('GroupstableComponent', () => {
  let component: GroupstableComponent;
  let fixture: ComponentFixture<GroupstableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupstableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
