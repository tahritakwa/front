import { StarkPermissionsDirective } from './permissions.directive';
import { Component } from '@angular/core';
import { StarkPermissionsModule } from '../stark-permissions.module';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { StarkPermissionsService } from '../service/permissions.service';
import { StarkRolesService } from '../service/roles.service';

enum PermissionsTestEnum {
    ADMIN = <any> 'ADMIN',
    GUEST = <any> 'GUEST'
}

describe('StarkPermissionsDirective', () => {
    it('should create an instance', () => {
        // const directive = new PermissionsDirective();
        expect(true).toBeTruthy();
    });
});

describe('Permission directive angular except', () => {
    @Component({selector: 'test-comp',
        template: `<ng-template permissions [starkPermissionsExcept]="'ADMIN'"><div>123</div></ng-template>`})
    class TestComp {
        data: any;
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should not show component', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        tick();
        fixture.detectChanges();
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

    }));

    it('Should  show the component', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

    }));

    it ('Should show the component', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');

        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');
    }));

    it ('Should hide component when permission added', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('123');

        permissionService.addPermission(PermissionsTestEnum.ADMIN);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
    }));

    it ('Should show component when permission removed', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);


        permissionService.removePermission(PermissionsTestEnum.ADMIN);
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('123');
    }));
});

describe('Permission directive angular only', () => {
    @Component({selector: 'test-comp',
        template: `<ng-template permissions [starkPermissionsOnly]="'ADMIN'"><div>123</div></ng-template>`})
    class TestComp {
        data: any;
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should show the component', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');
    }));
    it ('Should not show the component', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
    }));

    it ('Should show component when permission added', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionService.addPermission(PermissionsTestEnum.ADMIN);
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();

        expect(content2.innerHTML).toEqual('123');
    }));

    it ('Should hide component when permission removed', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('123');

        permissionService.removePermission(PermissionsTestEnum.ADMIN);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
    }));
});

describe('Permission directive angular roles only', () => {
    @Component({selector: 'test-comp',
        template: `<ng-template permissions [starkPermissionsOnly]="'ADMIN'"><div>123</div></ng-template>`})
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    let awesomePermissions = "AWESOME";
    let permissionsService;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);


    });


    it('Should show the component when key of role is the same', fakeAsync(() => {

        rolesService.addRole('ADMIN', [awesomePermissions]);
        permissionsService.addPermission(awesomePermissions);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');
    }));
    it ('should show the component when permissions array is the same ', fakeAsync(() => {
        rolesService.addRole('ADMIN', [awesomePermissions]);
        permissionsService.addPermission(awesomePermissions);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');
    }));

    it ('should hide the component when user deletes all roles', fakeAsync(() => {
        permissionsService.addPermission(awesomePermissions);
        rolesService.addRole('ADMIN', [awesomePermissions]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');

        rolesService.flushRoles();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it ('should hide the component when user deletes one role', fakeAsync(() => {
        permissionsService.addPermission(awesomePermissions);
        rolesService.addRole('ADMIN', [awesomePermissions]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');

        rolesService.removeRole("ADMIN");
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it ('should hide the when there is no two permissions', fakeAsync(() => {
        permissionsService.addPermission(awesomePermissions);
        rolesService.addRole('ADMIN', [awesomePermissions, 'noSUch permissions']);
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));
});
describe('Permission directive angular roles only array', () => {
    @Component({selector: 'test-comp',
        template: `<ng-template permissions [starkPermissionsOnly]="['ADMIN', 'GUEST']"><div>123</div></ng-template>`})
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    let permissionsService;
    let awesomePermission = "AWESOME";
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService =  fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should show the component when key of role is the same', fakeAsync(() => {
        permissionsService.addPermission(awesomePermission);
        rolesService.addRole('ADMIN', [awesomePermission]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');
    }));
    it ('should show the component when there is permission ', fakeAsync(() => {
        permissionsService.addPermission(awesomePermission);
        rolesService.addRole('ADMIN', ['AWESOME']);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');
    }));

    it ('should hide the component when user deletes all roles', fakeAsync(() => {
        permissionsService.addPermission(awesomePermission);
        rolesService.addRole('ADMIN', [awesomePermission]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');

        rolesService.flushRoles();
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it ('should hide the component when user deletes one roles', fakeAsync(() => {
        permissionsService.addPermission(awesomePermission);
        rolesService.addRole('ADMIN', [awesomePermission]);
        detectChanges(fixture);


        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');

        rolesService.removeRole("ADMIN");
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));
});

describe('Permission directive angular roles except', () => {
    @Component({selector: 'test-comp',
        template: `<ng-template permissions [starkPermissionsExcept]="'ADMIN'"><div>123</div></ng-template>`})
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    let permissionsService;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should hide the component when key of role is the same', fakeAsync(() => {
        permissionsService.addPermission('AWESOME');
        rolesService.addRole('ADMIN', ['AWESOME']);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
    }));
    it ('should show the component when permissions array is the same ', fakeAsync(() => {
        permissionsService.addPermission('AWESOME');
        rolesService.addRole('ADMIN', ['AWESOME']);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

    }));

    it ('should show the component when user deletes all roles', fakeAsync(() => {
        permissionsService.addPermission('AWESOME');
        rolesService.addRole('ADMIN', ['AWESOME']);
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);

        rolesService.flushRoles();
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');
    }));

    it ('should show the component when user deletes one role', fakeAsync(() => {
        permissionsService.addPermission('AWESOME');
        rolesService.addRole('ADMIN', ['AWESOME']);
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);

        rolesService.removeRole("ADMIN");
        detectChanges(fixture);


        let content = fixture.debugElement.nativeElement.querySelector('div');

        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');
    }));
});
describe('Permission directive angular roles except array', () => {
    @Component({selector: 'test-comp',
        template: `<ng-template permissions [starkPermissionsExcept]="['ADMIN', 'GUEST']"><div>123</div></ng-template>`})
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    let permissionsService;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should not show the component when user have permissions', fakeAsync(() => {
        permissionsService.addPermission('Awesome');
        rolesService.addRole('ADMIN', ['Awesome']);

        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

    }));
    it ('should show when there is no such permission', fakeAsync(() => {
        rolesService.addRole('ADMIN', ['Awesome']);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content.innerHTML).toEqual('123');

    }));

    it ('should show the component when user deletes all roles', fakeAsync(() => {
        permissionsService.addPermission('AWESOME');
        rolesService.addRole('ADMIN', ['AWESOME']);
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);

        rolesService.flushRoles();
        permissionsService.flushPermissions();
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('div');

        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');
    }));

    it ('should show the component when user deletes one roles', fakeAsync(() => {
        permissionsService.addPermission('SOMETHING');
        rolesService.addRole('ADMIN', ['SOMETHING']);
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);

        rolesService.removeRole("ADMIN");
        detectChanges(fixture);


        let content = fixture.debugElement.nativeElement.querySelector('div');

        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual('123');
    }));
});

describe('Permission directive angular testing different selectors *permmisionsOnly', () => {
    @Component({selector: 'test-comp',
        template: `<div *starkPermissionsOnly="['ADMIN']"><div>123</div></div>`})
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    let permissionsService;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should show the component when key of role is the same', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('AWESOME');
        rolesService.addRole('ADMIN', ['AWESOME']);
        detectChanges(fixture);


        let content2 = fixture.debugElement.nativeElement.querySelector('div');

        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should hide the component when key of role is the same', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        rolesService.addRole('GG', ['Awsesome']);
        detectChanges(fixture);


        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);

    }));
});

describe('Permission directive angular testing different selectors *permmisionsExcept', () => {
    @Component({selector: 'test-comp',
        template: `<div *starkPermissionsExcept="['ADMIN']"><div>123</div></div>`})
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);

    });


    it('Should show the component when key of role is the same', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        rolesService.addRole('Guest', ['Awsesome']);
        detectChanges(fixture);


        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should hide the component when key of role is the same', fakeAsync(() => {
        rolesService.addRole('ADMIN', ['Awsesome']);
        tick();
        fixture.detectChanges();


        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
    }));
});

describe('Permission directive angular testing different async functions in roles', () => {
    @Component({selector: 'test-comp',
        template: `<div *starkPermissionsOnly="'ADMIN'"><div>123</div></div>`})
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);

    });


    it('Should show the component when promise returns truthy value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        // rolesService.addRole('ADMIN', () => {
        //     return Promise.resolve();
        // });
        rolesService.addRole('ADMIN', () => {
            return true;
        });
        detectChanges(fixture);
        tick();

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should not show the component when promise returns truthy value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        rolesService.addRole('ADMIN', () => {
            return false;
        });
        detectChanges(fixture);
        tick();

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should show the component when promise returns truthy value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        rolesService.addRole('ADMIN', () => {
            return Promise.resolve(true);
        });
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should not show the component when promise rejects', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        rolesService.addRole('ADMIN', () => {
            return Promise.reject();
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));
});

describe('Permission directive angular testing different async functions in roles via array', () => {
    @Component({selector: 'test-comp',
        template: `<div *starkPermissionsOnly="['ADMIN','GUEST']"><div>123</div></div>`})
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    let permissionsService;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should show the component when promise returns truthy value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        // rolesService.addRole('ADMIN', () => {
        //     return Promise.resolve();
        // });
        rolesService.addRole('ADMIN', () => {
            return true;
        });
        detectChanges(fixture);
        tick();

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));


    it('Should not show the component when promise returns false value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        rolesService.addRole('ADMIN', () => {
            return false;
        });
        detectChanges(fixture);
        tick();

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should show the component when promise returns truthy value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        rolesService.addRole('ADMIN', () => {
            return Promise.resolve(true);
        });
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should not show the component when promise rejects', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        rolesService.addRole('ADMIN', () => {
            return Promise.reject();
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should  show the component when one of the promises fulfills ', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        rolesService.addRole('ADMIN', () => {
            return Promise.reject();
        });

        rolesService.addRole('GUEST', () => {
            return Promise.resolve(true);
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges()
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should  show the component when one of the promises fulfills with 0 value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        rolesService.addRole('ADMIN', () => {
            return Promise.reject();
        });

        rolesService.addRole('GUEST', () => {
            return Promise.resolve();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges()
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should not show the component when all promises fails', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        rolesService.addRole('ADMIN', () => {
            return Promise.reject();
        });

        rolesService.addRole('GUEST', () => {
            return Promise.reject();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should show the component when one of promises returns true', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);


        rolesService.addRole('GUEST', () => {
            return true;
        });


        rolesService.addRole('ADMIN', () => {
            return Promise.reject();
        });

        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));


    it('Should show the component when 1 passes second fails', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        rolesService.addRole('ADMIN', () => {
            return Promise.reject();
        });
        permissionsService.addPermission('AWESOME');
        rolesService.addRole('GUEST', ['AWESOME']);


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));


    it('Should show the component when one rejects but another one fullfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        rolesService.addRole('ADMIN', () => {
            return Promise.reject();
        });
        permissionsService.addPermission('AWESOME');
        rolesService.addRole('GUEST', ['AWESOME']);


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));
});

describe('Permission directive angular testing different async functions in permissions via array', () => {
    @Component({selector: 'test-comp',
        template: `<div *starkPermissionsOnly="['ADMIN','GUEST']"><div>123</div></div>`})
    class TestComp {
        data: any;
    }

    let permissionsService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should show the component when promise returns truthy value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        // rolesService.addRole('ADMIN', () => {
        //     return Promise.resolve();
        // });
        permissionsService.addPermission('ADMIN', () => {
            return true;
        });
        detectChanges(fixture);
        tick();

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));


    it('Should not show the component when promise returns false value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        permissionsService.addPermission('ADMIN', () => {
            return false;
        });
        detectChanges(fixture);
        tick();

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should show the component when promise returns truthy value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.resolve(true);
        });
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should not show the component when promise rejects', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.reject();
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should  show the component when one of the promises fulfills ', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.resolve();
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.reject();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should  show the component when one of the promises fulfills with 0 value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.resolve();
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.resolve();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges()
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should not show the component when all promises fails', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.reject();
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.reject();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should show the component when one of promises returns true', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);


        permissionsService.addPermission('GUEST', () => {
            return true;
        });


        permissionsService.addPermission('ADMIN', () => {
            return Promise.reject();
        });

        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));


    it('Should not show the component when all promises fails', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.reject();
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.resolve(true)
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));


    it('Should show the component when one rejects but another one fullfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.reject();
        });

        permissionsService.addPermission('GUEST', () => {
            return true;
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should show the component when one rejects but another one fullfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.reject();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should show the component when functions with name and store fullfils', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', (name, store) => {
            expect(store[name].name).toBeTruthy();
            return name === 'ADMIN'
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.reject();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));
});


describe('Permission directive angular testing different async functions in permissions via string', () => {
    @Component({selector: 'test-comp',
        template: `<div *starkPermissionsOnly="'ADMIN'"><div>123</div></div>`})
    class TestComp {
        data: any;
    }

    let permissionsService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should show the component when promise returns truthy value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        // rolesService.addRole('ADMIN', () => {
        //     return Promise.resolve();
        // });
        permissionsService.addPermission('ADMIN', () => {
            return true;
        });
        detectChanges(fixture);
        tick();

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));


    it('Should not show the component when promise returns false value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        permissionsService.addPermission('ADMIN', () => {
            return false;
        });
        detectChanges(fixture);
        tick();

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should show the component when promise returns truthy value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.resolve(true);
        });
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should not show the component when promise rejects', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.reject();
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should  show the component when one of the promises fulfills ', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.resolve();
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.resolve(true);
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges()
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should  show the component when one of the promises fulfills with 0 value', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.resolve();
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.reject();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges()
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should not show the component when all promises fails', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.reject();
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.reject();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should show the component when one of promises returns true', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);


        permissionsService.addPermission('GUEST', () => {
            return Promise.reject();
        });


        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));


    it('Should not show the component when all promises fails', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return Promise.resolve(true)
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.reject();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));


    it('Should show the component when one rejects but another one fullfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.reject();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));

    it('Should show the component when functions with name and store fullfils', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);
        permissionsService.addPermission('ADMIN', (name, store) => {
            expect(store[name].name).toBeTruthy();
            return name === 'ADMIN'
        });

        permissionsService.addPermission('GUEST', () => {
            return Promise.reject();
        });


        detectChanges(fixture);
        tick();
        tick();
        tick();
        fixture.detectChanges();
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('<div>123</div>');
    }));
});



describe('Permission  directive angular testing  different only and accept together async functions in permissions via string', () => {
    @Component({selector: 'test-comp',
        template: `<ng-template starkPermissionsOnly="ADMIN" starkPermissionsExcept="MANAGER"><div>123</div></ng-template>`})
    class TestComp {
        data: any;
    }

    let permissionsService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should show the component when permission except not available and only fullfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        tick();
        tick();
        tick();

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('123');
    }));

    it('Should NOT show the component when permission except fulfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        permissionsService.addPermission('MANAGER', () => {
            return true;
        });

        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should NOT show the component when permission except fulfills even when only also fullfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        permissionsService.addPermission('MANAGER', () => {
            return true;
        });

        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should show the component when permission except fulfills with function that returns false and only fullfiles', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        permissionsService.addPermission('MANAGER', () => {
            return false;
        });

        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('123');

    }));
});


describe('Permission  directive angular testing  different only and accept together async functions in permissions via array', () => {
    @Component({selector: 'test-comp',
        template: `<ng-template [starkPermissionsOnly]="['ADMIN', 'GUEST']" [starkPermissionsExcept]="['MANAGER']"><div>123</div></ng-template>`})
    class TestComp {
        data: any;
    }

    let permissionsService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should show the component when permission except not available and only fullfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        tick();
        tick();
        tick();

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('123');
    }));

    it('Should NOT show the component when permission except fulfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        permissionsService.addPermission('MANAGER', () => {
            return true;
        });

        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should NOT show the component when permission except fulfills even when only also fullfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        permissionsService.addPermission('MANAGER', () => {
            return true;
        });

        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should show the component when permission except fulfills with function that returns false and only fullfiles', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        permissionsService.addPermission('MANAGER', () => {
            return false;
        });

        permissionsService.addPermission('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('123');

    }));
});

describe('Permission  directive angular testing  different only and accept together async functions in roles via array', () => {
    @Component({selector: 'test-comp',
        template: `<ng-template [starkPermissionsOnly]="['ADMIN', 'GUEST']" [starkPermissionsExcept]="['MANAGER']"><div>123</div></ng-template>`})
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);

    });


    it('Should show the component when role except not available and only fullfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        rolesService.addRole('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('123');
    }));

    it('Should NOT show the component when role except fulfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        rolesService.addRole('MANAGER', () => {
            return true;
        });

        rolesService.addRole('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should NOT show the component when role except fulfills even when only also fullfills', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        rolesService.addRole('MANAGER', () => {
            return true;
        });

        rolesService.addRole('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toEqual(null);
    }));

    it('Should show the component when role except fulfills with function that returns false and only fullfiles', fakeAsync(() => {
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        rolesService.addRole('MANAGER', () => {
            return false;
        });

        rolesService.addRole('ADMIN', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('123');

    }));
});


describe('starkPermissionsOnly Directive testing else block', () => {
    @Component({selector: 'test-comp',
        template: `
            <div *starkPermissionsOnly="['FAILED_BLOCK']; else elseBlock">main</div>
            <ng-template #elseBlock>
                <div>elseBlock</div>
            </ng-template>
            <ng-template #thenBlock>
                <div>thenBlock</div>
            </ng-template>
           
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);

    });


    it('Should fail and show else block', fakeAsync(() => {
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`elseBlock`);
    }));

    it('Should add element remove element and show then block', fakeAsync(() => {

        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toEqual(null);

        rolesService.addRole('FAILED_BLOCK', () => {
            return true;
        });

        detectChanges(fixture);


        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual('main');

        rolesService.removeRole('FAILED_BLOCK');
        detectChanges(fixture);

        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`elseBlock`);
    }));

});

describe('starkPermissionsOnly Directive testing then block', () => {
    @Component({selector: 'test-comp',
        template: `
            <div *starkPermissionsOnly="['THEN_BLOCK']; else elseBlock; then thenBlock">main</div>
            <ng-template #elseBlock>
                <div>elseBlock</div>
            </ng-template>
            <ng-template #thenBlock>
                <div>thenBlock</div>
            </ng-template>
           
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);

    });


    it('Should fail and show then block', fakeAsync(() => {
        rolesService.addRole('THEN_BLOCK', () => {
            return true;
        });
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`thenBlock`);
    }));
});



describe('starkPermissionsExcept Directive testing else block', () => {
    @Component({selector: 'test-comp',
        template: `
            <div *starkPermissionsExcept="['MAIN_BLOCK']; else elseBlock">main</div>
            <ng-template #elseBlock>
                <div>elseBlock</div>
            </ng-template>
            <ng-template #thenBlock>
                thenBlock
            </ng-template>
           
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Should fail when adding role and show then block', fakeAsync(() => {

        rolesService.addRole('MAIN_BLOCK', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`elseBlock`);
    }));

    it('Should fail when adding permissions and show then block', fakeAsync(() => {
        detectChanges(fixture);
        let content = fixture.debugElement.nativeElement.querySelector('div');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual(`main`);

        permissionsService.addPermission('MAIN_BLOCK', () => {
            return true;
        });

        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`elseBlock`);
    }));
});

describe('starkPermissionsExcept Directive testing then block', () => {
    @Component({selector: 'test-comp',
        template: `
            <div *starkPermissionsExcept="['THEN_BLOCK']; else elseBlock; then thenBlock">main</div>
            <ng-template #elseBlock>
                <div>elseBlock</div>
            </ng-template>
            <ng-template #thenBlock>
                <div>thenBlock</div>
            </ng-template>
           
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissions;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);

    });


    it('Should fail and show then block', fakeAsync(() => {
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`thenBlock`);
    }));
});

describe('starkPermissionsExcept Directive with starkPermissionsOnly testing then block', () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsExcept]="'FAIL_BLOCK'" [starkPermissionsOnly]="'ONLY_BLOCK'" [starkPermissionsElse]="elseBlock">
              
            </ng-template>
            <ng-template #elseBlock>
                <div>elseBlock</div>
            </ng-template>
            <ng-template #thenBlock>
                <div>thenBlock</div>
            </ng-template>
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Except Should fail and show then block', fakeAsync(() => {
        permissionsService.addPermission('FAIL_BLOCK');
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`elseBlock`);
    }));

    it('Only Should fail and show then block', fakeAsync(() => {
        rolesService.addRole('SOME_BLOCK', () => {
            return true;
        });
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`elseBlock`);
    }));
});

describe('starkPermissionsExcept Directive with starkPermissionsOnly testing else block', () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsExcept]="'FAIL_BLOCK'" [starkPermissionsOnly]="'ONLY_BLOCK'" [starkPermissionsElse]="elseBlock">
              
            </ng-template>
            <ng-template #elseBlock>
                <div>elseBlock</div>
            </ng-template>
            <ng-template #thenBlock>
                <div>thenBlock</div>
            </ng-template>
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Except Should fail and show then block', fakeAsync(() => {
        permissionsService.addPermission('FAIL_BLOCK');
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`elseBlock`);
    }));

    it('Only Should fail and show then block', fakeAsync(() => {
        rolesService.addRole('SOME_BLOCK', () => {
            return true;
        });
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`elseBlock`);
    }));
});

describe('starkPermissionsExcept Directive with starkPermissionsOnly testing then block success', () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsExcept]="'FAIL_BLOCK'" [starkPermissionsOnly]="'ONLY_BLOCK'" [starkPermissionsElse]="elseBlock" [starkPermissionsThen]="thenBlock">
              
            </ng-template>
            <ng-template #elseBlock>
                <div>elseBlock</div>
            </ng-template>
            <ng-template #thenBlock>
                <div>thenBlock</div>
            </ng-template>
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Except and only should success and show then block', fakeAsync(() => {
        permissionsService.addPermission('ONLY_BLOCK');
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`thenBlock`);
    }));

    it('Except and only should success with role and show then block', fakeAsync(() => {
        rolesService.addRole('ONLY_BLOCK', () => {
            return true;
        });
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`thenBlock`);
    }));
});

describe('starkPermissionsExcept Directive with starkPermissionsOnly testing else block', () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsExcept]="'FAIL_BLOCK'" [starkPermissionsOnly]="'ONLY_BLOCK'" [starkPermissionsElse]="elseBlock">
              
            </ng-template>
            <ng-template #elseBlock>
                <div>elseBlock</div>
            </ng-template>
            <ng-template #thenBlock>
                <div>thenBlock</div>
            </ng-template>
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);

    });


    it('Except Should fail and show then block', fakeAsync(() => {
        permissionsService.addPermission('FAIL_BLOCK');
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`elseBlock`);
    }));

    it('Only Should fail and show then block', fakeAsync(() => {
        rolesService.addRole('SOME_BLOCK', () => {
            return true;
        });
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`elseBlock`);
    }));
});

describe("Stark Permissions Only Directive when no permission specified should return true", () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsOnly]="">
                <div>123</div>
            </ng-template>
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);
    });


    it('Except and only should success and show then block', fakeAsync(() => {
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`123`);
    }));
});

describe("Stark Permissions Except Directive when no permission specified should return true", () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsExcept]="">
                <div>123</div>
            </ng-template>
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);
    });


    it('Except and only should success and show then block', fakeAsync(() => {
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`123`);
    }));
});

describe("Stark Permissions Except Directive when no permission is empty array specified should return true", () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsOnly]="[]">
                <div>123</div>
            </ng-template>
        `

    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);
    });


    it('Except and only should success and show then block', fakeAsync(() => {
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`123`);
    }));
});


describe("Stark Permissions Except and only Directive when no permission specified should return true", () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsExcept]="" [starkPermissionsOnly]="">
                <div>123</div>
            </ng-template>
        `
    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);
    });


    it('Except and only should success and show then block', fakeAsync(() => {
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`123`);
    }));
});

describe("Stark Permissions Except and only Directive when no permission specified as array should return true", () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsExcept]="[]" [starkPermissionsOnly]="[]">
                <div>123</div>
            </ng-template>
        `
    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);
    });


    it('Except and only should success and show then block', fakeAsync(() => {
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`123`);
    }));
});

describe("Stark Permissions only Directive when no permission specified as array should return true", () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsOnly]="[]">
                <div>123</div>
            </ng-template>
        `
    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);
    });


    it('Except and only should success and show then block', fakeAsync(() => {
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`123`);
    }));
});

describe("Stark Permissions except Directive when no permission specified as array should return true", () => {
    @Component({selector: 'test-comp',
        template: `
            <ng-template [starkPermissionsExcept]="[]">
                <div>123</div>
            </ng-template>
        `
    })
    class TestComp {
        data: any;
    }

    let rolesService;
    let permissionsService;
    let fixture;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        rolesService = fixture.debugElement.injector.get(StarkRolesService);
        permissionsService = fixture.debugElement.injector.get(StarkPermissionsService);
    });


    it('Except and only should success and show then block', fakeAsync(() => {
        detectChanges(fixture);
        let content2 = fixture.debugElement.nativeElement.querySelector('div');
        expect(content2).toBeTruthy();
        expect(content2.innerHTML).toEqual(`123`);
    }));
});
function detectChanges(fixture) {
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
}