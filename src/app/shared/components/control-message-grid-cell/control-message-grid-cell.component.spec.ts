import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlMessageGridCellComponent } from './control-message-grid-cell.component';

describe('ControlMessageGridCellComponent', () => {
  let component: ControlMessageGridCellComponent;
  let fixture: ComponentFixture<ControlMessageGridCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlMessageGridCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlMessageGridCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
