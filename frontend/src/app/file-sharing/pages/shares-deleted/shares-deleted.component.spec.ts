import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharesDeletedComponent } from './shares-deleted.component';

describe('SharesDeletedComponent', () => {
  let component: SharesDeletedComponent;
  let fixture: ComponentFixture<SharesDeletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharesDeletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharesDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
