import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationFilterComponent } from './organization-filter.component';

describe('OrganizationFilterComponent', () => {
  let component: OrganizationFilterComponent;
  let fixture: ComponentFixture<OrganizationFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
