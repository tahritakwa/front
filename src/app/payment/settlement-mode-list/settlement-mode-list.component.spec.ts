import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModeListComponent } from './settlement-mode-list.component';

describe('PaymentModeListComponent', () => {
  let component: PaymentModeListComponent;
  let fixture: ComponentFixture<PaymentModeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentModeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentModeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
