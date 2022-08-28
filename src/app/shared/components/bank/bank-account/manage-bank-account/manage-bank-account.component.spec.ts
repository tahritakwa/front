import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBankAccountComponent } from './manage-bank-account.component';

describe('ManageBankAccountComponent', () => {
  let component: ManageBankAccountComponent;
  let fixture: ComponentFixture<ManageBankAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageBankAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
