import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddCnssDeclarationComponent} from './add-cnss-declaration.component';

describe('AddCnssDeclarationComponent', () => {
  let component: AddCnssDeclarationComponent;
  let fixture: ComponentFixture<AddCnssDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCnssDeclarationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCnssDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
