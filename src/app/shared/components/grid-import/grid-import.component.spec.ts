import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridImportComponent } from './grid-import.component';

describe('GridImportComponent', () => {
  let component: GridImportComponent;
  let fixture: ComponentFixture<GridImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
