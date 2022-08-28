import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegistersListComponent } from './cash-registers-list.component';

describe('CashRegistersListComponent', () => {
  let component: CashRegistersListComponent;
  let fixture: ComponentFixture<CashRegistersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegistersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegistersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
