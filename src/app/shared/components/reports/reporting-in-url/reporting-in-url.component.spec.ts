import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingInUrlComponent } from './reporting-in-url.component';

describe('ReportingInUrlComponent', () => {
  let component: ReportingInUrlComponent;
  let fixture: ComponentFixture<ReportingInUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingInUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingInUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
