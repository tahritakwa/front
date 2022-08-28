import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInterventionOperationsComponent } from './add-intervention-operations.component';

describe('AddInterventionOperationsComponent', () => {
  let component: AddInterventionOperationsComponent;
  let fixture: ComponentFixture<AddInterventionOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInterventionOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterventionOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
