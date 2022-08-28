import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRequestListComponent } from './price-request-list.component';

describe('PriceRequestListComponent', () => {
  let component: PriceRequestListComponent;
  let fixture: ComponentFixture<PriceRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
