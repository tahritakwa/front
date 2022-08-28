import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityArchivingComponent } from './opportunity-archiving.component';

describe('OpportunityArchivingComponent', () => {
  let component: OpportunityArchivingComponent;
  let fixture: ComponentFixture<OpportunityArchivingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityArchivingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityArchivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
