import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSalesDeliveryGenerationListComponent } from './error-sales-delivery-generation-list.component';

describe('ErrorSalesDeliveryGenerationListComponent', () => {
  let component: ErrorSalesDeliveryGenerationListComponent;
  let fixture: ComponentFixture<ErrorSalesDeliveryGenerationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorSalesDeliveryGenerationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSalesDeliveryGenerationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
