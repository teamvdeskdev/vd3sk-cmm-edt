import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatefileDialogComponent } from './createfile-dialog.component';

describe('CreatefileDialogComponent', () => {
  let component: CreatefileDialogComponent;
  let fixture: ComponentFixture<CreatefileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatefileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatefileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
