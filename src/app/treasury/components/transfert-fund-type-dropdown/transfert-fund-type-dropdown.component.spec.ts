import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertFundTypeDropdownComponent } from './transfert-fund-type-dropdown.component';

describe('TransfertFundTypeDropdownComponent', () => {
  let component: TransfertFundTypeDropdownComponent;
  let fixture: ComponentFixture<TransfertFundTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfertFundTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertFundTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
