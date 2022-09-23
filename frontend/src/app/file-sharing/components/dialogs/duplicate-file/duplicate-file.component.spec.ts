import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateFileComponent } from './duplicate-file.component';

describe('DuplicateFileComponent', () => {
  let component: DuplicateFileComponent;
  let fixture: ComponentFixture<DuplicateFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
