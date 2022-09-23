import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedFilesComponent } from './protected-files.component';

describe('ProtectedFilesComponent', () => {
  let component: ProtectedFilesComponent;
  let fixture: ComponentFixture<ProtectedFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtectedFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectedFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
