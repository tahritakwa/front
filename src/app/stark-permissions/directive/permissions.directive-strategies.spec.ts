import { Component, Renderer2, TemplateRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { StarkPermissionsModule } from '../stark-permissions.module';
import { StarkPermissionsService } from '../service/permissions.service';
import { StarkPermissionsConfigurationService } from '../service/configuration.service';
import { StarkPermissionsPredefinedStrategies } from '../enums/predefined-strategies.enum';

enum PermissionsTestEnum {
    ADMIN = <any> 'ADMIN',
    GUEST = <any> 'GUEST'
}

describe('Permission directive angular only configuration', () => {
    @Component({selector: 'test-comp',
        template: `<button  *starkPermissionsOnly="'ADMIN'"><div>123</div></button>`})
    class TestComp {
        data: any;
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: StarkPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
          renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(StarkPermissionsService);
        configurationService = fixture.debugElement.injector.get(StarkPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });


    it('Should disable component when default method is defined', fakeAsync(() => {
        configurationService.addPermissionStrategy(disable, disableFunction);
        configurationService.setDefaultOnAuthorizedStrategy(disable);
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);

    }));

    it ('Should show the component when predefined show strategy is selected', fakeAsync(() => {
        configurationService.setDefaultOnAuthorizedStrategy(StarkPermissionsPredefinedStrategies.SHOW);
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual(correctTemplate);
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        configurationService.setDefaultOnAuthorizedStrategy(StarkPermissionsPredefinedStrategies.REMOVE);
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBe(null);
    }));

    it('Should disable component when default unauthorized method is defined', fakeAsync(() => {
        configurationService.addPermissionStrategy(disable, disableFunction);
        configurationService.setDefaultOnUnauthorizedStrategy(disable);
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);

    }));

    it ('Should show the component when predefined default unauthorized show strategy is selected', fakeAsync(() => {
        configurationService.setDefaultOnUnauthorizedStrategy(StarkPermissionsPredefinedStrategies.SHOW);
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual(correctTemplate);
    }));

    it ('Should remove the component when predefined default unauthorized remove strategy is selected', fakeAsync(() => {
        configurationService.setDefaultOnUnauthorizedStrategy(StarkPermissionsPredefinedStrategies.REMOVE);
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBe(null);
    }));
});


describe('Permission directive angular strategies configuration passed by template', () => {
    @Component({selector: 'test-comp',
        template: `<button  *starkPermissionsOnly="'ADMIN'; authorisedStrategy: 'remove'; unauthorisedStrategy: 'show'" starkPermissionsUnAuthorisedStrategy="show"><div>123</div></button>`})
    class TestComp {
        data: any;
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: StarkPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(StarkPermissionsService);
        configurationService = fixture.debugElement.injector.get(StarkPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should hide the component when predefined hide strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toEqual(null);
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual(correctTemplate);
    }));

});


describe('Permission directive angular strategies configuration passed by template except', () => {
    @Component({selector: 'test-comp',
        template: `<button  *starkPermissionsExcept="'ADMIN'; authorisedStrategy: 'remove'; unauthorisedStrategy: 'show'"><div>123</div></button>`})
    class TestComp {
        data: any;

    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: StarkPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>';
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(StarkPermissionsService);
        configurationService = fixture.debugElement.injector.get(StarkPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should hide the component when predefined hide strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toEqual(null);
    }));

    it ('Should show the component when predefined remove strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN,  PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual(correctTemplate);
    }));

});


describe('Permission directive angular strategies as function configuration passed by template', () => {
    @Component({selector: 'test-comp',
        template: `<button  *starkPermissionsOnly="'ADMIN'; authorisedStrategy: disabled; unauthorisedStrategy: disabled"><div>123</div></button>`})
    class TestComp {
        data: any;
        public disabled(templateRef: TemplateRef<any>) {
            templateRef.elementRef.nativeElement.nextSibling.setAttribute('disabled', true)
        }
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: StarkPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(StarkPermissionsService);
        configurationService = fixture.debugElement.injector.get(StarkPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should disable the component when disabled function is passed', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

});

describe('Permission directive angular strategies as function configuration passed by template except permissions', () => {
    @Component({selector: 'test-comp',
        template: `<button  *starkPermissionsExcept="'ADMIN'; authorisedStrategy: disabled; unauthorisedStrategy: disabled"><div>123</div></button>`})
    class TestComp {
        data: any;
        public disabled(templateRef: TemplateRef<any>) {
            templateRef.elementRef.nativeElement.nextSibling.setAttribute('disabled', true)
        }
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: StarkPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(StarkPermissionsService);
        configurationService = fixture.debugElement.injector.get(StarkPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should disable the component when disabled function is passed', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

});


describe('Permission directive angular strategies as function passed in configuration except permissions', () => {
    @Component({selector: 'test-comp',
        template: `<button  *starkPermissionsExcept="'ADMIN'; authorisedStrategy: 'disable'; unauthorisedStrategy: 'disable'"><div>123</div></button>`})
    class TestComp {
        data: any;
        public disabled(templateRef: TemplateRef<any>) {
            templateRef.elementRef.nativeElement.nextSibling.setAttribute('disabled', true)
        }
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: StarkPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(StarkPermissionsService);
        configurationService = fixture.debugElement.injector.get(StarkPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should disable the component when disabled function is passed', fakeAsync(() => {
        configurationService.addPermissionStrategy(disable, disableFunction);

        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        configurationService.addPermissionStrategy(disable, disableFunction);

        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

});


describe('Permission directive angular strategies as function passed in configuration except permissions', () => {
    @Component({selector: 'test-comp',
        template: `<button  *starkPermissionsOnly="'ADMIN'; authorisedStrategy: 'disable'; unauthorisedStrategy: 'disable'"><div>123</div></button>`})
    class TestComp {
        data: any;
        public disabled(templateRef: TemplateRef<any>) {
            templateRef.elementRef.nativeElement.nextSibling.setAttribute('disabled', true)
        }
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: StarkPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(StarkPermissionsService);
        configurationService = fixture.debugElement.injector.get(StarkPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should disable the component when disabled function is passed', fakeAsync(() => {
        configurationService.addPermissionStrategy(disable, disableFunction);

        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        configurationService.addPermissionStrategy(disable, disableFunction);

        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

});


describe('test predefined strategies', () => {
    @Component({selector: 'test-comp',
        template: `<button  *starkPermissionsOnly="'ADMIN'; authorisedStrategy: 'show'; unauthorisedStrategy: 'remove'"><div>123</div></button>`})
    class TestComp {
        data: any;
        public disabled(templateRef: TemplateRef<any>) {
            templateRef.elementRef.nativeElement.nextSibling.setAttribute('disabled', true)
        }
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: StarkPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [StarkPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(StarkPermissionsService);
        configurationService = fixture.debugElement.injector.get(StarkPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should disable the component when disabled function is passed', fakeAsync(() => {

        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        configurationService.addPermissionStrategy(disable, disableFunction);

        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toEqual(null);
    }));

});


function detectChanges(fixture) {
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

}
