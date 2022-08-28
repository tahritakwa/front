import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryFormsListComponent } from './delivery-forms-list.component';

describe('DeliveryFormsListComponent', () => {
  let component: DeliveryFormsListComponent;
  let fixture: ComponentFixture<DeliveryFormsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryFormsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryFormsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
