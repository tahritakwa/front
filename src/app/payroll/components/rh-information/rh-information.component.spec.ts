import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RhInformationComponent} from './rh-information.component';

describe('RhInformationComponent', () => {
  let component: RhInformationComponent;
  let fixture: ComponentFixture<RhInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RhInformationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
