import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryFormsAddComponent } from './delivery-forms-add.component';

describe('DeliveryFormsAddComponent', () => {
  let component: DeliveryFormsAddComponent;
  let fixture: ComponentFixture<DeliveryFormsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryFormsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryFormsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
