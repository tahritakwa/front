import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContractTypeDropdownComponent} from './contract-type-dropdown.component';

describe('ContractTypeDropdownComponent', () => {
  let component: ContractTypeDropdownComponent;
  let fixture: ComponentFixture<ContractTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContractTypeDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
