import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridMachineComponent } from './grid-machine.component';

describe('GridMachineComponent', () => {
  let component: GridMachineComponent;
  let fixture: ComponentFixture<GridMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
