import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrongPayslipListComponent } from './wrong-payslip-list.component';

describe('WrongPayslipListComponent', () => {
  let component: WrongPayslipListComponent;
  let fixture: ComponentFixture<WrongPayslipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrongPayslipListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongPayslipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
