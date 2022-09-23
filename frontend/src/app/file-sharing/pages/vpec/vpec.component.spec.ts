import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VpecComponent } from './vpec.component';

describe('VpecComponent', () => {
  let component: VpecComponent;
  let fixture: ComponentFixture<VpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
