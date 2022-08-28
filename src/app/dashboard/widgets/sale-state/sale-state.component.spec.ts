import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleStateComponent } from './sale-state.component';

describe('SaleStateComponent', () => {
  let component: SaleStateComponent;
  let fixture: ComponentFixture<SaleStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
