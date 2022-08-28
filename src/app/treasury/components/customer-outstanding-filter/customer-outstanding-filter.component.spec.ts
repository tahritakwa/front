import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOutstandingFilterComponent } from './customer-outstanding-filter.component';

describe('CustomerOutstandingFilterComponent', () => {
  let component: CustomerOutstandingFilterComponent;
  let fixture: ComponentFixture<CustomerOutstandingFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOutstandingFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOutstandingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
