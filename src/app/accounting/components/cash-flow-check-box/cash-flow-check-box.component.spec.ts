import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowCheckBoxComponent } from './cash-flow-check-box.component';

describe('CashFlowCheckBoxComponent', () => {
  let component: CashFlowCheckBoxComponent;
  let fixture: ComponentFixture<CashFlowCheckBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashFlowCheckBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashFlowCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
