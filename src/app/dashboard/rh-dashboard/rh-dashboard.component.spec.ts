import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhDashboardComponent } from './rh-dashboard.component';

describe('RhDashboardComponent', () => {
  let component: RhDashboardComponent;
  let fixture: ComponentFixture<RhDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
