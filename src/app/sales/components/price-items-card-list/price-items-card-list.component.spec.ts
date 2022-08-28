import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceItemsCardListComponent } from './price-items-card-list.component';

describe('PriceItemsCardListComponent', () => {
  let component: PriceItemsCardListComponent;
  let fixture: ComponentFixture<PriceItemsCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceItemsCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceItemsCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
