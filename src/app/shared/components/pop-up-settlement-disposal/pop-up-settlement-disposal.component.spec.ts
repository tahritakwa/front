import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpSettlementDisposalComponent } from './pop-up-settlement-disposal.component';

describe('PopUpSettlementDisposalComponent', () => {
  let component: PopUpSettlementDisposalComponent;
  let fixture: ComponentFixture<PopUpSettlementDisposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpSettlementDisposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpSettlementDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
