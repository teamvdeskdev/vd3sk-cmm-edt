import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedByOthersComponent } from './shared-by-others.component';

describe('SharedByOthersComponent', () => {
  let component: SharedByOthersComponent;
  let fixture: ComponentFixture<SharedByOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedByOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedByOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
