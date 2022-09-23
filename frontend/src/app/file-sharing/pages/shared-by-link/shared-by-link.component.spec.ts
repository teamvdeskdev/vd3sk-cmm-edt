import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedByLinkComponent } from './shared-by-link.component';

describe('SharedByLinkComponent', () => {
  let component: SharedByLinkComponent;
  let fixture: ComponentFixture<SharedByLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedByLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedByLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
