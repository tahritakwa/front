import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaimDetailsComponent } from './add-claim-details.component';

describe('AddClaimDetailsComponent', () => {
  let component: AddClaimDetailsComponent;
  let fixture: ComponentFixture<AddClaimDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClaimDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
