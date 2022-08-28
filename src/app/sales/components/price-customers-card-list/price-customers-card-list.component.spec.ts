import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceCustomersCardListComponent } from './price-customers-card-list.component';

describe('PriceCustomersCardListComponent', () => {
  let component: PriceCustomersCardListComponent;
  let fixture: ComponentFixture<PriceCustomersCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceCustomersCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceCustomersCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
