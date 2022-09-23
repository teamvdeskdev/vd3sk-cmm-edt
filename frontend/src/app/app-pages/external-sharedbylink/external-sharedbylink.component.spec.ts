import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalSharedbylinkComponent } from './external-sharedbylink.component';

describe('ExternalSharedbylinkComponent', () => {
  let component: ExternalSharedbylinkComponent;
  let fixture: ComponentFixture<ExternalSharedbylinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalSharedbylinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalSharedbylinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
