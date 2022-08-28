import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationAddComponent } from './organisation-add.component';

describe('OrganisationAddComponent', () => {
  let component: OrganisationAddComponent;
  let fixture: ComponentFixture<OrganisationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
