import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsRemindersCustomSnackbarComponent } from './news-reminders-custom-snackbar.component';

describe('NewsRemindersCustomSnackbarComponent', () => {
  let component: NewsRemindersCustomSnackbarComponent;
  let fixture: ComponentFixture<NewsRemindersCustomSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsRemindersCustomSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsRemindersCustomSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
