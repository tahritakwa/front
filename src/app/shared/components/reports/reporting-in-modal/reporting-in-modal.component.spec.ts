import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingInModalComponent } from './reporting-in-modal.component';

describe('ReportingInModalComponent', () => {
  let component: ReportingInModalComponent;
  let fixture: ComponentFixture<ReportingInModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingInModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingInModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
