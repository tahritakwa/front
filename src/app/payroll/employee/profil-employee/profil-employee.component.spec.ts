import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilEmployeeComponent } from './profil-employee.component';

describe('ProfilEmployeeComponent', () => {
  let component: ProfilEmployeeComponent;
  let fixture: ComponentFixture<ProfilEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
