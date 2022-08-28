import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageDashboardComponent } from './garage-dashboard.component';

describe('GarageDashboardComponent', () => {
  let component: GarageDashboardComponent;
  let fixture: ComponentFixture<GarageDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarageDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
