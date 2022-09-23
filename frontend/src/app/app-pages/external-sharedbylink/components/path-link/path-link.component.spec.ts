import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathLinkComponent } from './path-link.component';

describe('PathLinkComponent', () => {
  let component: PathLinkComponent;
  let fixture: ComponentFixture<PathLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
