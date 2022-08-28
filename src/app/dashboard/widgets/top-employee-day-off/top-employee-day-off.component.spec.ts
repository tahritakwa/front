import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopEmployeeDayOffComponent } from './top-employee-day-off.component';

describe('TopEmployeeDayOffComponent', () => {
  let component: TopEmployeeDayOffComponent;
  let fixture: ComponentFixture<TopEmployeeDayOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopEmployeeDayOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopEmployeeDayOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
