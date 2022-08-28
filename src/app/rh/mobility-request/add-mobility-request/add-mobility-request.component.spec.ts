import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddMobilityRequestComponent} from './add-mobility-request.component';

describe('AddMobilityRequestComponent', () => {
  let component: AddMobilityRequestComponent;
  let fixture: ComponentFixture<AddMobilityRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddMobilityRequestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMobilityRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
