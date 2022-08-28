import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassValidationComponent } from './mass-validation.component';

describe('MassValidationComponent', () => {
  let component: MassValidationComponent;
  let fixture: ComponentFixture<MassValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
