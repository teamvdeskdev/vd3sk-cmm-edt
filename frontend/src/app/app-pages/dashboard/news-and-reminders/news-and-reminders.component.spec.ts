import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAndRemindersComponent } from './news-and-reminders.component';

describe('NewsAndRemindersComponent', () => {
  let component: NewsAndRemindersComponent;
  let fixture: ComponentFixture<NewsAndRemindersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsAndRemindersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsAndRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
