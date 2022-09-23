import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSetupMenuComponent } from './share-setup-menu.component';

describe('PermissionSetupComponent', () => {
  let component: ShareSetupMenuComponent;
  let fixture: ComponentFixture<ShareSetupMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareSetupMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareSetupMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
