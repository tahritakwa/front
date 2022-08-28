import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartForInterventionComponent } from './spare-part-for-intervention.component';

describe('SparePartForInterventionComponent', () => {
  let component: SparePartForInterventionComponent;
  let fixture: ComponentFixture<SparePartForInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparePartForInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartForInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
