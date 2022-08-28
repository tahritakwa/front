import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavOrganisationDetailsComponent } from './side-nav-organisation-details.component';

describe('SideNavOrganisationDetailsComponent', () => {
  let component: SideNavOrganisationDetailsComponent;
  let fixture: ComponentFixture<SideNavOrganisationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavOrganisationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavOrganisationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
