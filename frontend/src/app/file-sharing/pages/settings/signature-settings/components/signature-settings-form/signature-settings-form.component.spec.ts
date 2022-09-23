import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureSettingsFormComponent } from './signature-settings-form.component';

describe('SignatureSettingsFormComponent', () => {
  let component: SignatureSettingsFormComponent;
  let fixture: ComponentFixture<SignatureSettingsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureSettingsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
