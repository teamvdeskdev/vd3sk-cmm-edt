import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VflowComponent } from './vflow.component';

describe('VflowComponent', () => {
  let component: VflowComponent;
  let fixture: ComponentFixture<VflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
