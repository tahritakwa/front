import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PayslipPreviewComponent} from './payslip-preview.component';

describe('PayslipPreviewComponent', () => {
  let component: PayslipPreviewComponent;
  let fixture: ComponentFixture<PayslipPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PayslipPreviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
