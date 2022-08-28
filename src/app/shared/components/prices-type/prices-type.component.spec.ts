import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesTypeComponent } from './prices-type.component';

describe('PricesTypeComponent', () => {
  let component: PricesTypeComponent;
  let fixture: ComponentFixture<PricesTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricesTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
