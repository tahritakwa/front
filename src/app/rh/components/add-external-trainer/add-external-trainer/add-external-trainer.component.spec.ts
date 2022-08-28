import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddExternalTrainerComponent} from './add-external-trainer.component';

describe('AddExternalTrainerComponent', () => {
  let component: AddExternalTrainerComponent;
  let fixture: ComponentFixture<AddExternalTrainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddExternalTrainerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExternalTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
