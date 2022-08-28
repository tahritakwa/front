import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAmortizationConfigurationComponent } from './list-amortization-configuration.component';

describe('ListAmortizationConfigurationComponent', () => {
  let component: ListAmortizationConfigurationComponent;
  let fixture: ComponentFixture<ListAmortizationConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAmortizationConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAmortizationConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
