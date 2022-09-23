import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyPostItItemComponent } from './empty-post-it-item.component';

describe('EmptyPostItItemComponent', () => {
  let component: EmptyPostItItemComponent;
  let fixture: ComponentFixture<EmptyPostItItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyPostItItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyPostItItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
