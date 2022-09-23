import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedDocumentsFolderComponent } from './signed-documents-folder.component';

describe('SignedDocumentsFolderComponent', () => {
  let component: SignedDocumentsFolderComponent;
  let fixture: ComponentFixture<SignedDocumentsFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignedDocumentsFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedDocumentsFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
