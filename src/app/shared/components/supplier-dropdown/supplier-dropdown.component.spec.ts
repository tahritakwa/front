import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDropdownComponent } from './supplier-dropdown.component';

describe('SupplierDropdownComponent', () => {
    let component: SupplierDropdownComponent;
    let fixture: ComponentFixture<SupplierDropdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SupplierDropdownComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SupplierDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
