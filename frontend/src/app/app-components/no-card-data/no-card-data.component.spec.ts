import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCardDataComponent } from './no-card-data.component';

describe('NoCardDataComponent', () => {
  let component: NoCardDataComponent;
  let fixture: ComponentFixture<NoCardDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoCardDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoCardDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
