import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceCustomersAffectionListComponent } from './price-customers-affection-list.component';

describe('PriceCustomersAffectionListComponent', () => {
  let component: PriceCustomersAffectionListComponent;
  let fixture: ComponentFixture<PriceCustomersAffectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceCustomersAffectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceCustomersAffectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
