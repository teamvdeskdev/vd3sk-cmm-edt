import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostItItemComponent } from './post-it-item.component';

describe('PostItItemComponent', () => {
  let component: PostItItemComponent;
  let fixture: ComponentFixture<PostItItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostItItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostItItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
