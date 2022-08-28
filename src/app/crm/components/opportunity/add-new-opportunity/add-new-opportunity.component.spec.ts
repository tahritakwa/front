import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewOpportunityComponent } from './add-new-opportunity.component';

describe('AddNewOpportunityComponent', () => {
  let component: AddNewOpportunityComponent;
  let fixture: ComponentFixture<AddNewOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
