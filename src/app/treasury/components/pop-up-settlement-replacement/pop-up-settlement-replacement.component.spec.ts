import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpSettlementReplacementComponent } from './pop-up-settlement-replacement.component';

describe('PopUpSettlementReplacementComponent', () => {
  let component: PopUpSettlementReplacementComponent;
  let fixture: ComponentFixture<PopUpSettlementReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpSettlementReplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpSettlementReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
