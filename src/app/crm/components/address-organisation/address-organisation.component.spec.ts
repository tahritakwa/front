import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressOrganisationComponent } from './address-organisation.component';

describe('AddressOrganisationComponent', () => {
  let component: AddressOrganisationComponent;
  let fixture: ComponentFixture<AddressOrganisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressOrganisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
