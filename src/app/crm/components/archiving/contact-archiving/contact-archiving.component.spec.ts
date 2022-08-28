import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactArchivingComponent } from './contact-archiving.component';

describe('ContactArchivingComponent', () => {
  let component: ContactArchivingComponent;
  let fixture: ComponentFixture<ContactArchivingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactArchivingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactArchivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
