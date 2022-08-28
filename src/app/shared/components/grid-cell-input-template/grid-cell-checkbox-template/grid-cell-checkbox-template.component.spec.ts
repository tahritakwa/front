import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCellCheckboxTemplateComponent } from './grid-cell-checkbox-template.component';

describe('GridCellCheckboxTemplateComponent', () => {
  let component: GridCellCheckboxTemplateComponent;
  let fixture: ComponentFixture<GridCellCheckboxTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCellCheckboxTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCellCheckboxTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
