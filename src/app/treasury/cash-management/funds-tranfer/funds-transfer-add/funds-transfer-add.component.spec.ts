import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsTransferAddComponent } from './funds-transfer-add.component';

describe('FundsTransferAddComponent', () => {
  let component: FundsTransferAddComponent;
  let fixture: ComponentFixture<FundsTransferAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsTransferAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsTransferAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
