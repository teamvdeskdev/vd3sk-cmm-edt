import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VshareFavoritesTableComponent } from './vshare-favorites-table.component';

describe('VshareFavoritesTableComponent', () => {
  let component: VshareFavoritesTableComponent;
  let fixture: ComponentFixture<VshareFavoritesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VshareFavoritesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VshareFavoritesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
