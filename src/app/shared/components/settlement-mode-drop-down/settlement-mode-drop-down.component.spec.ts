import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementModeDropDownComponent } from './settlement-mode-drop-down.component';

describe('SettlementModeDropDownComponent', () => {
  let component: SettlementModeDropDownComponent;
  let fixture: ComponentFixture<SettlementModeDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementModeDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementModeDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
