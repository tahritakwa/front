import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridImportBsComponent } from './grid-import-bs.component';

describe('GridImportBsComponent', () => {
  let component: GridImportBsComponent;
  let fixture: ComponentFixture<GridImportBsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridImportBsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridImportBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
