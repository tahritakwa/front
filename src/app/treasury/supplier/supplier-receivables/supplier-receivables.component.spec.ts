import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierReceivablesComponent } from './supplier-receivables.component';

describe('SupplierReceivablesComponent', () => {
  let component: SupplierReceivablesComponent;
  let fixture: ComponentFixture<SupplierReceivablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierReceivablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
