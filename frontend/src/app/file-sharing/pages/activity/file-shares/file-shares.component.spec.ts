import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSharesComponent } from './file-shares.component';

describe('FileSharesComponent', () => {
  let component: FileSharesComponent;
  let fixture: ComponentFixture<FileSharesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSharesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSharesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
