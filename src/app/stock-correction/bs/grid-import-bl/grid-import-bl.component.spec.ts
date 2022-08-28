import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridImportBlComponent } from './grid-import-bl.component';

describe('GridImportBlComponent', () => {
  let component: GridImportBlComponent;
  let fixture: ComponentFixture<GridImportBlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridImportBlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridImportBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
