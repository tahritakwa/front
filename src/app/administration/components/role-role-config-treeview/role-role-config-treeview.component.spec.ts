import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleRoleConfigTreeviewComponent } from './role-role-config-treeview.component';

describe('RoleRoleConfigTreeviewComponent', () => {
    let component: RoleRoleConfigTreeviewComponent;
    let fixture: ComponentFixture<RoleRoleConfigTreeviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoleRoleConfigTreeviewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoleRoleConfigTreeviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
