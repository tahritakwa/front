import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TecdocDetailsApiComponent } from './tecdoc-details-api.component';

describe('TecdocDetailsApiComponent', () => {
  let component: TecdocDetailsApiComponent;
  let fixture: ComponentFixture<TecdocDetailsApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TecdocDetailsApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TecdocDetailsApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
