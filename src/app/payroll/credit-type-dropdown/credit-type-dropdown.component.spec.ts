import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreditTypeDropdownComponent} from './credit-type-dropdown.component';

describe('CreditTypeDropdownComponent', () => {
  let component: CreditTypeDropdownComponent;
  let fixture: ComponentFixture<CreditTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditTypeDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
