import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllfilesTableComponent } from './allfiles-table.component';

describe('AllfilesTableComponent', () => {
  let component: AllfilesTableComponent;
  let fixture: ComponentFixture<AllfilesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllfilesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllfilesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
