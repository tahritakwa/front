import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdvencedBankComponent } from './add-advenced-bank.component';

describe('AddAdvencedBankComponent', () => {
  let component: AddAdvencedBankComponent;
  let fixture: ComponentFixture<AddAdvencedBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdvencedBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdvencedBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
