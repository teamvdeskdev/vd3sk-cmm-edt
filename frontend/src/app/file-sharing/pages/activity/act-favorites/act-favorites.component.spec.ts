import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActFavoritesComponent } from './act-favorites.component';

describe('ActFavoritesComponent', () => {
  let component: ActFavoritesComponent;
  let fixture: ComponentFixture<ActFavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActFavoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
