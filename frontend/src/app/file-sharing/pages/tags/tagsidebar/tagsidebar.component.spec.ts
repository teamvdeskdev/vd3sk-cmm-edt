import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsidebarComponent } from './tagsidebar.component';

describe('TagsidebarComponent', () => {
  let component: TagsidebarComponent;
  let fixture: ComponentFixture<TagsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
