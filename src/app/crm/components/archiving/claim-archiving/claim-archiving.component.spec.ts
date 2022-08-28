import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimArchivingComponent } from './claim-archiving.component';

describe('ClaimArchivingComponent', () => {
  let component: ClaimArchivingComponent;
  let fixture: ComponentFixture<ClaimArchivingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimArchivingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimArchivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
