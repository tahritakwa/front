import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineOperationsComponent } from './machine-operations.component';

describe('MachineOperationsComponent', () => {
  let component: MachineOperationsComponent;
  let fixture: ComponentFixture<MachineOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
