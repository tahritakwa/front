import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequestAddComponent } from './purchase-request-add.component';

describe('PurchaseRequestAddComponent', () => {
  let component: PurchaseRequestAddComponent;
  let fixture: ComponentFixture<PurchaseRequestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseRequestAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
