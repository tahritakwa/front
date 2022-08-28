import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavClaimComponent } from './side-nav-claim.component';

describe('SideNavClaimComponent', () => {
  let component: SideNavClaimComponent;
  let fixture: ComponentFixture<SideNavClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
