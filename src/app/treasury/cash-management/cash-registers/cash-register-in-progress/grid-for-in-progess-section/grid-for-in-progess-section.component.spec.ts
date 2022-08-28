import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridForInProgessSectionComponent } from './grid-for-in-progess-section.component';

describe('GridForInProgessSectionComponent', () => {
  let component: GridForInProgessSectionComponent;
  let fixture: ComponentFixture<GridForInProgessSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridForInProgessSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridForInProgessSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
