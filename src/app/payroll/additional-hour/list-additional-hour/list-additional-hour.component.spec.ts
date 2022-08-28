import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ListAdditionalHourComponent} from './list-additional-hour.component';

describe('ListAdditionalHourComponent', () => {
  let component: ListAdditionalHourComponent;
  let fixture: ComponentFixture<ListAdditionalHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListAdditionalHourComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdditionalHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
