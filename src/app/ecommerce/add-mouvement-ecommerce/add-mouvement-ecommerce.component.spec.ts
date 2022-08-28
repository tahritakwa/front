import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMouvementEcommerceComponent } from './add-mouvement-ecommerce.component';

describe('AddMouvementEcommerceComponent', () => {
  let component: AddMouvementEcommerceComponent;
  let fixture: ComponentFixture<AddMouvementEcommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMouvementEcommerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMouvementEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
