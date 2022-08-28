import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListCnssDeclarationComponent} from './list-cnss-declaration.component';

describe('ListCnssDeclarationComponent', () => {
  let component: ListCnssDeclarationComponent;
  let fixture: ComponentFixture<ListCnssDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListCnssDeclarationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCnssDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
