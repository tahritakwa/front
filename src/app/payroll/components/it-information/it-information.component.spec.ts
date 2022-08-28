import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItInformationComponent} from './it-information.component';

describe('ItInformationComponent', () => {
  let component: ItInformationComponent;
  let fixture: ComponentFixture<ItInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItInformationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
