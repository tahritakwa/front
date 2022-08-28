import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRequestGridComponent } from './price-request-grid.component';

describe('PriceRequestGridComponent', () => {
  let component: PriceRequestGridComponent;
  let fixture: ComponentFixture<PriceRequestGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceRequestGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceRequestGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
