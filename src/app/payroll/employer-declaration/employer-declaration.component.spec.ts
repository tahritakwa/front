import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployerDeclarationComponent} from './employer-declaration.component';

describe('EmployerDeclarationComponent', () => {
  let component: EmployerDeclarationComponent;
  let fixture: ComponentFixture<EmployerDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployerDeclarationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
