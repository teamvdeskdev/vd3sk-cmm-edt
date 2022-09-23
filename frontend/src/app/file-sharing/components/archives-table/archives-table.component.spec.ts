import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivesTableComponent } from './archives-table.component';

describe('ArchivesTableComponent', () => {
  let component: ArchivesTableComponent;
  let fixture: ComponentFixture<ArchivesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
