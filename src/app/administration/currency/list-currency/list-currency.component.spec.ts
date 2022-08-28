import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCurrencyComponent } from './list-currency.component';

describe('ListCurrencyComponent', () => {
  let component: ListCurrencyComponent;
  let fixture: ComponentFixture<ListCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
