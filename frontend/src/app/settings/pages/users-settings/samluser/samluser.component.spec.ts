import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamluserComponent } from './samluser.component';

describe('SamluserComponent', () => {
  let component: SamluserComponent;
  let fixture: ComponentFixture<SamluserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamluserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamluserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
