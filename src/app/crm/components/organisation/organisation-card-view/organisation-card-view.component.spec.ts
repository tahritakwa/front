import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationCardViewComponent } from './organisation-card-view.component';

describe('OrganisationCardViewComponent', () => {
  let component: OrganisationCardViewComponent;
  let fixture: ComponentFixture<OrganisationCardViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationCardViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
