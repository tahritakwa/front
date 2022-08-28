import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AddAdditionalHourComponent} from './add-additional-hour.component';

describe('AddAdditionalHourComponent', () => {
  let component: AddAdditionalHourComponent;
  let fixture: ComponentFixture<AddAdditionalHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddAdditionalHourComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdditionalHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
