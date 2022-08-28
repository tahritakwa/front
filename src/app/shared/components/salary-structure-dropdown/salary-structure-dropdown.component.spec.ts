import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureDropdownComponent } from './salary-structure-dropdown.component';

describe('SalaryStructureDropdownComponent', () => {
  let component: SalaryStructureDropdownComponent;
  let fixture: ComponentFixture<SalaryStructureDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryStructureDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryStructureDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
