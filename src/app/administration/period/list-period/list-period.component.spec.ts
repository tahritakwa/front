import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPeriodComponent } from './list-period.component';

describe('ListPeriodComponent', () => {
  let component: ListPeriodComponent;
  let fixture: ComponentFixture<ListPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
