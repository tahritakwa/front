import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleConfigCategoryTreeviewComponent } from './role-config-category-treeview.component';

describe('RoleConfigCategoryTreeviewComponent', () => {
    let component: RoleConfigCategoryTreeviewComponent;
    let fixture: ComponentFixture<RoleConfigCategoryTreeviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoleConfigCategoryTreeviewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoleConfigCategoryTreeviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
