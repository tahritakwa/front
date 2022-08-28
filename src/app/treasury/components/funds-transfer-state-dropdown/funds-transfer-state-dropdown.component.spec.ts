import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsTransferStateDropdownComponent } from './funds-transfer-state-dropdown.component';

describe('FundsTransferStateDropdownComponent', () => {
  let component: FundsTransferStateDropdownComponent;
  let fixture: ComponentFixture<FundsTransferStateDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsTransferStateDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsTransferStateDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
