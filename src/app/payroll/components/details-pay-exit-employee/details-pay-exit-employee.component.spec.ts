import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsPayExitEmployeeComponent} from './details-pay-exit-employee.component';

describe('DetailsPayExitEmployeeComponent', () => {
  let component: DetailsPayExitEmployeeComponent;
  let fixture: ComponentFixture<DetailsPayExitEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsPayExitEmployeeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPayExitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
