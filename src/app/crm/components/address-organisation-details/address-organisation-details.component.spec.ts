import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressOrganisationDetailsComponent } from './address-organisation-details.component';

describe('AddressOrganisationDetailsComponent', () => {
  let component: AddressOrganisationDetailsComponent;
  let fixture: ComponentFixture<AddressOrganisationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressOrganisationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressOrganisationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
