import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListCnssTypeComponent} from './list-cnss-type.component';

describe('ListCnssTypeComponent', () => {
  let component: ListCnssTypeComponent;
  let fixture: ComponentFixture<ListCnssTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListCnssTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCnssTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
