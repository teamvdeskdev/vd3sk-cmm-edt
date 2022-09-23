import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMoveCopyFileComponent } from './copy-file.component';

describe('DialogMoveCopyFileComponent', () => {
  let component: DialogMoveCopyFileComponent;
  let fixture: ComponentFixture<DialogMoveCopyFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMoveCopyFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMoveCopyFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
