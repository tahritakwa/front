import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOutstandingMenuComponent } from './customer-outstanding-menu.component';

describe('CustomerOutstandingMenuComponent', () => {
  let component: CustomerOutstandingMenuComponent;
  let fixture: ComponentFixture<CustomerOutstandingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOutstandingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOutstandingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
