import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamluserDialogcreateComponent } from './samluser-dialogcreate.component';

describe('SamluserDialogcreateComponent', () => {
  let component: SamluserDialogcreateComponent;
  let fixture: ComponentFixture<SamluserDialogcreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamluserDialogcreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamluserDialogcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
