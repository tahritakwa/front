import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationArchivingComponent } from './organisation-archiving.component';

describe('OrganisationArchivingComponent', () => {
  let component: OrganisationArchivingComponent;
  let fixture: ComponentFixture<OrganisationArchivingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationArchivingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationArchivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
