import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyDropdownComponent } from './agency-dropdown.component';

describe('AgencyDropdownComponent', () => {
  let component: AgencyDropdownComponent;
  let fixture: ComponentFixture<AgencyDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
