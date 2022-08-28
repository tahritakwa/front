import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridBsComponent } from './grid-bs.component';

describe('GridBsComponent', () => {
  let component: GridBsComponent;
  let fixture: ComponentFixture<GridBsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridBsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
