import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardViewBankAccountComponent } from './card-view-bank-account.component';

describe('CardViewBankAccountComponent', () => {
  let component: CardViewBankAccountComponent;
  let fixture: ComponentFixture<CardViewBankAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardViewBankAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardViewBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
