import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamluserTableComponent } from './samluser-table.component';

describe('SamluserTableComponent', () => {
  let component: SamluserTableComponent;
  let fixture: ComponentFixture<SamluserTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamluserTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamluserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
