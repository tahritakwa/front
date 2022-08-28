import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionGarageComponent } from './intervention-garage.component';

describe('InterventionGarageComponent', () => {
  let component: InterventionGarageComponent;
  let fixture: ComponentFixture<InterventionGarageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionGarageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionGarageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
