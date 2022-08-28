import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridWorkerComponent } from './grid-worker.component';

describe('GridWorkerComponent', () => {
  let component: GridWorkerComponent;
  let fixture: ComponentFixture<GridWorkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridWorkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
