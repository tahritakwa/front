import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountingConfigurationComponent } from './add-accounting-configuration.component';

describe('AddAccountingConfigurationComponent', () => {
  let component: AddAccountingConfigurationComponent;
  let fixture: ComponentFixture<AddAccountingConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccountingConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccountingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
