import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridOperationComponent } from './grid-operation.component';

describe('GridOperationComponent', () => {
  let component: GridOperationComponent;
  let fixture: ComponentFixture<GridOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
