import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AdditionalHourSlotComponent} from './additional-hour-slot.component';

describe('AdditionalHourSlotComponent', () => {
  let component: AdditionalHourSlotComponent;
  let fixture: ComponentFixture<AdditionalHourSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalHourSlotComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalHourSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
