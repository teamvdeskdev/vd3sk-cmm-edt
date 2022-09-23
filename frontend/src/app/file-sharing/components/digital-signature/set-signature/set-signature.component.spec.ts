import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSignatureComponent } from './set-signature.component';

describe('SetSignatureComponent', () => {
  let component: SetSignatureComponent;
  let fixture: ComponentFixture<SetSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
