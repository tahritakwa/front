import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContractInformationsComponent} from './contract-informations.component';

describe('ContractInformationsComponent', () => {
  let component: ContractInformationsComponent;
  let fixture: ComponentFixture<ContractInformationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContractInformationsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
