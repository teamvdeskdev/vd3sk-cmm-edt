import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeedUrlDialogComponent } from './add-feed-url-dialog.component';

describe('AddFeedUrlDialogComponent', () => {
  let component: AddFeedUrlDialogComponent;
  let fixture: ComponentFixture<AddFeedUrlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFeedUrlDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeedUrlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
