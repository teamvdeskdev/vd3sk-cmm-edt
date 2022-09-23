import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyFeedItemComponent } from './empty-feed-item.component';

describe('EmptyFeedItemComponent', () => {
  let component: EmptyFeedItemComponent;
  let fixture: ComponentFixture<EmptyFeedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyFeedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyFeedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
