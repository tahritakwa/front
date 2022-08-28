import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegistersAddComponent } from './cash-registers-add.component';

describe('CashRegistersAddComponent', () => {
  let component: CashRegistersAddComponent;
  let fixture: ComponentFixture<CashRegistersAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegistersAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegistersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
