import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsTransferListComponent } from './funds-transfer-list.component';

describe('FundsTransferListComponent', () => {
  let component: FundsTransferListComponent;
  let fixture: ComponentFixture<FundsTransferListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsTransferListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
