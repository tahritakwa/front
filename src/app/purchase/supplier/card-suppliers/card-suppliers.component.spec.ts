import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSuppliersComponent } from './card-suppliers.component';

describe('CardSuppliersComponent', () => {
  let component: CardSuppliersComponent;
  let fixture: ComponentFixture<CardSuppliersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSuppliersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
