import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryFormNotBilledComponent } from './delivery-form-not-billed.component';

describe('DeliveryFormNotBilledComponent', () => {
  let component: DeliveryFormNotBilledComponent;
  let fixture: ComponentFixture<DeliveryFormNotBilledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryFormNotBilledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryFormNotBilledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
