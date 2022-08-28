import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListTransferOrderComponent} from './list-transfer-order.component';

describe('ListTransferOrderComponent', () => {
  let component: ListTransferOrderComponent;
  let fixture: ComponentFixture<ListTransferOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListTransferOrderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTransferOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
