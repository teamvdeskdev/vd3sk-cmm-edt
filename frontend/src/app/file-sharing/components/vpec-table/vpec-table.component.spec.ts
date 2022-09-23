import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VpecTableComponent } from './vpec-table.component';

describe('VpecTableComponent', () => {
  let component: VpecTableComponent;
  let fixture: ComponentFixture<VpecTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VpecTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VpecTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
