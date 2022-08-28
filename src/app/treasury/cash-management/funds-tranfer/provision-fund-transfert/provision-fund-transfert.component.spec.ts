import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionFundTransfertComponent } from './provision-fund-transfert.component';

describe('ProvisionFundTransfertComponent', () => {
  let component: ProvisionFundTransfertComponent;
  let fixture: ComponentFixture<ProvisionFundTransfertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionFundTransfertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionFundTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
