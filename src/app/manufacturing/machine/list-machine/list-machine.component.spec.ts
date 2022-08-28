import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMachineComponent } from './list-machine.component';

describe('ListMachineComponent', () => {
  let component: ListMachineComponent;
  let fixture: ComponentFixture<ListMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
