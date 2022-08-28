import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotitateQtyComponent } from './negotitate-qty.component';

describe('NegotitateQtyComponent', () => {
  let component: NegotitateQtyComponent;
  let fixture: ComponentFixture<NegotitateQtyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegotitateQtyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegotitateQtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
