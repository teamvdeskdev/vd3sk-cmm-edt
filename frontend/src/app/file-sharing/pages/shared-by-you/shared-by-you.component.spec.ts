import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedByYouComponent } from './shared-by-you.component';

describe('SharedByYouComponent', () => {
  let component: SharedByYouComponent;
  let fixture: ComponentFixture<SharedByYouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedByYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedByYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
