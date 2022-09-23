import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowPageComponent } from './flow-page.component';

describe('LoginTotpComponent', () => {
  let component: FlowPageComponent;
  let fixture: ComponentFixture<FlowPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
