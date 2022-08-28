import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsProposedGridComponent } from './operations-proposed-grid.component';

describe('OperationsProposedGridComponent', () => {
  let component: OperationsProposedGridComponent;
  let fixture: ComponentFixture<OperationsProposedGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsProposedGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsProposedGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
