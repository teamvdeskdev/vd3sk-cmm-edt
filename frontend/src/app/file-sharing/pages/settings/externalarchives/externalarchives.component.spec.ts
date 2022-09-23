import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalArchivesComponent } from './externalarchives.component';

describe('ExternalArchivesComponent', () => {
  let component: ExternalArchivesComponent;
  let fixture: ComponentFixture<ExternalArchivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalArchivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
