import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TecdocDetailsComponent } from './tecdoc-details.component';

describe('TecdocDetailsComponent', () => {
  let component: TecdocDetailsComponent;
  let fixture: ComponentFixture<TecdocDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TecdocDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TecdocDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
