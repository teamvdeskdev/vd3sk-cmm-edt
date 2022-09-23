import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllfilesSidebarComponent } from './allfiles-sidebar.component';

describe('AllfilesSidebarComponent', () => {
  let component: AllfilesSidebarComponent;
  let fixture: ComponentFixture<AllfilesSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllfilesSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllfilesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
