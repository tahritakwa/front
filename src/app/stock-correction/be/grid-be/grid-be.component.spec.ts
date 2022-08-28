import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridBeComponent } from './grid-be.component';

describe('GridBeComponent', () => {
  let component: GridBeComponent;
  let fixture: ComponentFixture<GridBeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridBeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridBeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
