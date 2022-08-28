import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceItemsAffectionListComponent } from './price-items-affection-list.component';

describe('PriceItemsAffectionListComponent', () => {
  let component: PriceItemsAffectionListComponent;
  let fixture: ComponentFixture<PriceItemsAffectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceItemsAffectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceItemsAffectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
