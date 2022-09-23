import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostItDialogComponent } from './add-post-it-dialog.component';

describe('AddPostItDialogComponent', () => {
  let component: AddPostItDialogComponent;
  let fixture: ComponentFixture<AddPostItDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPostItDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostItDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
