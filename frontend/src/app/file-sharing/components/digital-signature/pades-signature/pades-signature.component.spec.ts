import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PadesSignatureComponent } from './pades-signature.component';

describe('PadesSignatureComponent', () => {
  let component: PadesSignatureComponent;
  let fixture: ComponentFixture<PadesSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PadesSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PadesSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
