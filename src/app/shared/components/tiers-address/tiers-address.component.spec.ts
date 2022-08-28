import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiersAddressComponent } from './tiers-address.component';

describe('TiersAddressComponent', () => {
  let component: TiersAddressComponent;
  let fixture: ComponentFixture<TiersAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiersAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiersAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
