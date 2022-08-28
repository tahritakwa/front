import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalStartersExitsComponent } from './total-starters-exits.component';

describe('TotalStartersExitsComponent', () => {
  let component: TotalStartersExitsComponent;
  let fixture: ComponentFixture<TotalStartersExitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalStartersExitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalStartersExitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
