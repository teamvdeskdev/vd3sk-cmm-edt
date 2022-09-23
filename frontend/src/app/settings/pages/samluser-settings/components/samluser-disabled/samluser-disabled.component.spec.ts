import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamluserDisabledComponent } from './samluser-disabled.component';

describe('SamluserDisabledComponent', () => {
  let component: SamluserDisabledComponent;
  let fixture: ComponentFixture<SamluserDisabledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamluserDisabledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamluserDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
