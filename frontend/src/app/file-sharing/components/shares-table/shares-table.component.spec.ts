import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharesTableComponent } from './shares-table.component';

describe('SharesTableComponent', () => {
  let component: SharesTableComponent;
  let fixture: ComponentFixture<SharesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
