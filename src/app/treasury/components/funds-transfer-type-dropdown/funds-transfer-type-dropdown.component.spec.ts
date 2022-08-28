import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsTransferTypeDropdownComponent } from './funds-transfer-type-dropdown.component';

describe('FundsTransferTypeDropdownComponent', () => {
  let component: FundsTransferTypeDropdownComponent;
  let fixture: ComponentFixture<FundsTransferTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsTransferTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsTransferTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
