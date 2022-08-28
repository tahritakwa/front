import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStateComponent } from './order-state.component';

describe('OrderStateComponent', () => {
  let component: OrderStateComponent;
  let fixture: ComponentFixture<OrderStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
