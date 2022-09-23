import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovecopyDialogComponent } from './movecopy-dialog.component';

describe('MovecopyDialogComponent', () => {
  let component: MovecopyDialogComponent;
  let fixture: ComponentFixture<MovecopyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovecopyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovecopyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
