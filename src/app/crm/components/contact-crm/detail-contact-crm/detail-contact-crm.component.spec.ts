import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailContactCrmComponent } from './detail-contact-crm.component';

describe('DetailContactCrmComponent', () => {
  let component: DetailContactCrmComponent;
  let fixture: ComponentFixture<DetailContactCrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailContactCrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailContactCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
