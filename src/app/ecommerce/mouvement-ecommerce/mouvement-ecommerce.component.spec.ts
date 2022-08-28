import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouvementEcommerceComponent } from './mouvement-ecommerce.component';

describe('MouvementEcommerceComponent', () => {
  let component: MouvementEcommerceComponent;
  let fixture: ComponentFixture<MouvementEcommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouvementEcommerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouvementEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
