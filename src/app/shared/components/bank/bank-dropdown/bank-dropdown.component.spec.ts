import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDropdownComponent } from './bank-dropdown.component';

describe('BankDropdownComponent', () => {
  let component: BankDropdownComponent;
  let fixture: ComponentFixture<BankDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
