import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalarchivesComponent } from './externalarchives.component';

describe('ExternalarchivesComponent', () => {
  let component: ExternalarchivesComponent;
  let fixture: ComponentFixture<ExternalarchivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalarchivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalarchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
