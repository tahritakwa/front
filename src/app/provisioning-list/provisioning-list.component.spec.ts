import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisioningListComponent } from './provisioning-list.component';

describe('ProvisioningListComponent', () => {
  let component: ProvisioningListComponent;
  let fixture: ComponentFixture<ProvisioningListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisioningListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisioningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
