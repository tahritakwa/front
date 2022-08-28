import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequestSerachComponent } from './purchase-request-serach.component';

describe('PurchaseRequestSerachComponent', () => {
  let component: PurchaseRequestSerachComponent;
  let fixture: ComponentFixture<PurchaseRequestSerachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseRequestSerachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRequestSerachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
