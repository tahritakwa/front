import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListMobilityRequestComponent} from './list-mobility-request.component';

describe('ListMobilityRequestComponent', () => {
  let component: ListMobilityRequestComponent;
  let fixture: ComponentFixture<ListMobilityRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListMobilityRequestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMobilityRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
