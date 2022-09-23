import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyofficeblackComponent } from './onlyofficeblack.component';

describe('OnlyofficeblackComponent', () => {
  let component: OnlyofficeblackComponent;
  let fixture: ComponentFixture<OnlyofficeblackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlyofficeblackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlyofficeblackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
