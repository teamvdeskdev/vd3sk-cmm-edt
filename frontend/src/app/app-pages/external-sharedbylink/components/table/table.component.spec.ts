import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponentLink } from './table.component';

describe('TableComponentLink', () => {
  let component: TableComponentLink;
  let fixture: ComponentFixture<TableComponentLink>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableComponentLink ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponentLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
