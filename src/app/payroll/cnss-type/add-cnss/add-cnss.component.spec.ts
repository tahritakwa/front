import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddCnssComponent} from './add-cnss.component';

describe('AddCnssComponent', () => {
  let component: AddCnssComponent;
  let fixture: ComponentFixture<AddCnssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCnssComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCnssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
