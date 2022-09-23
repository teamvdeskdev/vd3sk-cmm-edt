import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingsamlComponent } from './landingsaml.component';

describe('LandingsamlComponent', () => {
  let component: LandingsamlComponent;
  let fixture: ComponentFixture<LandingsamlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingsamlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingsamlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
