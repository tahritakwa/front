import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementListProductComponent } from './replacement-list-product.component';

describe('ReplacementListProductComponent', () => {
  let component: ReplacementListProductComponent;
  let fixture: ComponentFixture<ReplacementListProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplacementListProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
