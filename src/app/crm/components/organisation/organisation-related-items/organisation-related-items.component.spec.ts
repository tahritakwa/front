import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationRelatedItemsComponent } from './organisation-related-items.component';

describe('OrganisationRelatedItemsComponent', () => {
  let component: OrganisationRelatedItemsComponent;
  let fixture: ComponentFixture<OrganisationRelatedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationRelatedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationRelatedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
