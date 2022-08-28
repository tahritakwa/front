import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToogleBtnFilterComponent } from './toogle-btn-filter.component';

describe('ToogleBtnFilterComponent', () => {
  let component: ToogleBtnFilterComponent;
  let fixture: ComponentFixture<ToogleBtnFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToogleBtnFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToogleBtnFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
