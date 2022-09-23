import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureTableComponent } from './signature-table.component';

describe('SignatureTableComponent', () => {
  let component: SignatureTableComponent;
  let fixture: ComponentFixture<SignatureTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
