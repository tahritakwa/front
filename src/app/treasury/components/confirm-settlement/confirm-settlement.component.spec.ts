import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSettlementComponent } from './confirm-settlement.component';

describe('ConfirmSettlementComponent', () => {
  let component: ConfirmSettlementComponent;
  let fixture: ComponentFixture<ConfirmSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
