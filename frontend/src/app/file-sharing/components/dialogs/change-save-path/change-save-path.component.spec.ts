import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSavePathComponent } from './change-save-path.component';

describe('ChangeSavePathComponent', () => {
  let component: ChangeSavePathComponent;
  let fixture: ComponentFixture<ChangeSavePathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeSavePathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSavePathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
