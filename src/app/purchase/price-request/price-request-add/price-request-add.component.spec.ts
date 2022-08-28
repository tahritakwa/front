import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRequestAddComponent } from './price-request-add.component';

describe('PriceRequestAddComponent', () => {
  let component: PriceRequestAddComponent;
  let fixture: ComponentFixture<PriceRequestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceRequestAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
