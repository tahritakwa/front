import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddTrainingCenterComponent} from './add-training-center.component';

describe('AddTrainingCenterComponent', () => {
  let component: AddTrainingCenterComponent;
  let fixture: ComponentFixture<AddTrainingCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddTrainingCenterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrainingCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
