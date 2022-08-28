import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSparePartsComponent } from './grid-spare-parts.component';

describe('GridSparePartsComponent', () => {
  let component: GridSparePartsComponent;
  let fixture: ComponentFixture<GridSparePartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSparePartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSparePartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
