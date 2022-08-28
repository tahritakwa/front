import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCellInputTemplateComponent } from './grid-cell-input-template.component';

describe('GridCellInputTemplateComponent', () => {
  let component: GridCellInputTemplateComponent;
  let fixture: ComponentFixture<GridCellInputTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCellInputTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCellInputTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
