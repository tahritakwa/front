import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsUserCredentialsComponent } from './details-user-credentials.component';

describe('DetailsUserCredentialsComponent', () => {
  let component: DetailsUserCredentialsComponent;
  let fixture: ComponentFixture<DetailsUserCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsUserCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsUserCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
