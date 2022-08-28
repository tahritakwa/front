import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavOpportunityDetailsComponent } from './side-nav-opportunity-details.component';

describe('SideNavOpportunityDetailsComponent', () => {
  let component: SideNavOpportunityDetailsComponent;
  let fixture: ComponentFixture<SideNavOpportunityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavOpportunityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavOpportunityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
