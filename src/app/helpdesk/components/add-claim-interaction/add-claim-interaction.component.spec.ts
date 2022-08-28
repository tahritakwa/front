import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaimInteractionComponent } from './add-claim-interaction.component';

describe('GerestockComponent', () => {
  let component: AddClaimInteractionComponent;
  let fixture: ComponentFixture<AddClaimInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClaimInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClaimInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
