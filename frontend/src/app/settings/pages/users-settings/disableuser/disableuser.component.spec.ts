import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableuserComponent } from './disableuser.component';

describe('DisableuserComponent', () => {
  let component: DisableuserComponent;
  let fixture: ComponentFixture<DisableuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisableuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisableuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
