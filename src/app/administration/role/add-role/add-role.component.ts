import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { RoleConstant } from '../../../constant/Administration/role.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { Module } from '../../../models/auth/module.model';
import { Permission } from '../../../models/auth/permission.model';
import { Role, RoleDto } from '../../../models/auth/role.model';
import { SubModule } from '../../../models/auth/submodule.model';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ModuleServiceJava } from '../../services/role/module-service-java.service';
import { RoleJavaService } from '../../services/role/role.java.service';
import { RoleService } from '../../services/role/role.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})

export class AddRoleComponent implements OnInit {


  roleFormGroup: FormGroup;
  public modules: Module[] = new Array<Module>();
  isUpdateMode: boolean;
  predicate: PredicateFormat;

  selectedKeyForRoleConfig: any[] = [];
  private id: number;
  public filtredMenu : Module[] ;
  public valueToSearch : string ;
  public searching = false ;
  public listOfCheckedPermissions :any[];
  /** Permissions */
  public hasAddPermission = false;
  public hasUpdatePermission = false;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;

  /**
   *
   * @param fb
   * @param roleService
   * @param roleConfigService
   * @param moduleByRoleService
   * @param activatedRoute
   * @param styleConfigService
   * @param growlService
   * @param translate
   * @param router
   * @param validationService
   */
  constructor(private fb: FormBuilder,
    public roleService: RoleService,
    private activatedRoute: ActivatedRoute,
    private growlService: GrowlService,
    private translate: TranslateService,
    private roleServiceJava: RoleJavaService,
    private moduleServiceJava: ModuleServiceJava,
    private authService: AuthService,
    private localStorageService : LocalStorageService,
    private router: Router, private validationService: ValidationService,private styleConfigService: StyleConfigService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
  }



  /* Prepare Add form component  */
  private createAddForm(): void {
    this.roleFormGroup = this.fb.group({
      Id: [this.id || 0],
      Code: ['', Validators.required],
      Label: ['', Validators.required]
    });
  }

  saveRole() {
    if (this.roleFormGroup.valid) {
      this.isSaveOperation = true;
      let roleToSave:RoleDto = new RoleDto();
      roleToSave.Id=this.roleFormGroup.value.Id;
      roleToSave.Code=this.roleFormGroup.value.Code;
      roleToSave.Label=this.roleFormGroup.value.Label;
      roleToSave.CompanyCode=this.localStorageService.getCompanyCode();
      roleToSave.Permissions = new Array<number>();
      for(let moduleIndex=0; moduleIndex<this.modules.length; moduleIndex++){
        const module:Module = this.modules[moduleIndex];
        const subModules:SubModule[] = module.subModules;
        for(let subModuleIndex=0; subModuleIndex<subModules.length; subModuleIndex++){
          const subModule:SubModule = subModules[subModuleIndex];
          const permissions:Permission[] = subModule.permissions;
          for(let permissionIndex=0; permissionIndex<permissions.length; permissionIndex++){
            const permission:Permission = permissions[permissionIndex];
            if(permission.isChecked){
              roleToSave.Permissions.push(permission.id);
            }
          }
        }
      }
      this.roleServiceJava.getJavaGenericService().saveEntity(roleToSave).subscribe(data=>{
            this.router.navigate([RoleConstant.URL_ROLE_LIST], { skipLocationChange: true });
      });

    } else {
      this.validationService.validateAllFormFields(this.roleFormGroup);
    }
  }



  ngOnInit(): void {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_ROLE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_ROLE);
    this.createAddForm();
    this.getRoleHierarchy();

  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.roleFormGroup.touched;
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
  getRoleHierarchy() {
    this.moduleServiceJava.getJavaGenericService().getEntityList('modules').subscribe((menu: Module[]) => {
      for (let moduleIndex = 0; moduleIndex < menu.length; moduleIndex++) {
        menu[moduleIndex].label = this.translate.instant(menu[moduleIndex].code);
        menu[moduleIndex].isChecked = false;
        if (menu[moduleIndex].subModules.length !== 0) {
          menu[moduleIndex].items = menu[moduleIndex].subModules;
        }
        for (let subModuleIndex = 0; subModuleIndex < menu[moduleIndex].subModules.length; subModuleIndex++) {
          menu[moduleIndex].subModules[subModuleIndex].label = this.translate.instant(menu[moduleIndex].subModules[subModuleIndex].code);
          menu[moduleIndex].subModules[subModuleIndex].isChecked = false;
          menu[moduleIndex].subModules[subModuleIndex].items = menu[moduleIndex].subModules[subModuleIndex].permissions;
          for (let permissionIndex = 0; permissionIndex < menu[moduleIndex].subModules[subModuleIndex].items.length; permissionIndex++) {
            menu[moduleIndex].subModules[subModuleIndex].items[permissionIndex].label =
              this.translate.instant(menu[moduleIndex].subModules[subModuleIndex].items[permissionIndex].code);
            menu[moduleIndex].subModules[subModuleIndex].items[permissionIndex].isChecked = false;
          }
        }
      }
      this.modules = menu;
      if (this.isUpdateMode) {
        this.roleServiceJava.getJavaGenericService().getEntityById(this.id).subscribe((role: Role) => {
          this.roleFormGroup.controls['Id'].setValue(role.Id);
          this.roleFormGroup.controls['Code'].setValue(role.Code);
          this.roleFormGroup.controls['Label'].setValue(role.Label);
          if (role.Permissions.length !== 0) {
            const userPermissions: number[] = role.Permissions.map(permission => permission.id);
            for (let moduleIndex = 0; moduleIndex < this.modules.length; moduleIndex++) {
              const module: Module = this.modules[moduleIndex];
              for (let subModuleIndex = 0; subModuleIndex < this.modules[moduleIndex].subModules.length; subModuleIndex++) {
                const subModule: SubModule = module.subModules[subModuleIndex];
                for (let permissionIndex = 0; permissionIndex < subModule.permissions.length; permissionIndex++) {
                  const permission: Permission = subModule.permissions[permissionIndex];
                  if (userPermissions.indexOf(permission.id) > -1) {
                    permission.isChecked = true;
                    }
                }
                if(subModule.permissions.filter(x => x.isChecked).length == subModule.permissions.length){
                  subModule.isChecked = true;
                } else if(subModule.permissions.filter(x => x.isChecked).length == 0){
                  subModule.isChecked = false;
                } else {
                  subModule.IsIndeterminate = true;
                }

              }
              if(module.subModules.filter(x => x.isChecked).length == module.subModules.length){
                module.isChecked = true;
              } else if(module.subModules.filter(x => x.isChecked).length == 0 && module.subModules.filter(x => x.IsIndeterminate).length == 0){
                module.isChecked = false;
              } else {
                module.IsIndeterminate = true;
              }
            }
          }
          if (this.isUpdateMode && !this.hasUpdatePermission) {
            this.roleFormGroup.disable();
          }
        });
      }
    });
  }

  public search(){
    this.listOfCheckedPermissions = [];
    for(let moduleIndex=0; moduleIndex< this.modules.length; moduleIndex++){
      const module:Module = this.modules[moduleIndex];
      for(let subModuleIndex=0; subModuleIndex< this.modules[moduleIndex].subModules.length; subModuleIndex++){
        this.listOfCheckedPermissions = this.listOfCheckedPermissions.concat(module.subModules[subModuleIndex].permissions.filter(x=> x.isChecked == true).map(r=>r.id));
      }
    }
    if(this.valueToSearch){
      this.searching = true ;
      this.filtredMenu = this.modules.filter(x=> this.translate.instant(x.label).toUpperCase().includes(this.valueToSearch.toUpperCase()))
      for (let moduleIndex = 0; moduleIndex < this.filtredMenu.length; moduleIndex++) {
        this.filtredMenu[moduleIndex].label = this.translate.instant(this.filtredMenu[moduleIndex].code);
        this.filtredMenu[moduleIndex].isChecked = false;
        if(this.filtredMenu[moduleIndex].subModules.length != 0) {
          this.filtredMenu[moduleIndex].items = this.filtredMenu[moduleIndex].subModules;
         }
        for (let subModuleIndex = 0; subModuleIndex < this.filtredMenu[moduleIndex].subModules.length; subModuleIndex++) {
          this.filtredMenu[moduleIndex].subModules[subModuleIndex].label = this.translate.instant(this.filtredMenu[moduleIndex].subModules[subModuleIndex].code);
          this.filtredMenu[moduleIndex].subModules[subModuleIndex].isChecked = false;
          this.filtredMenu[moduleIndex].subModules[subModuleIndex].items = this.filtredMenu[moduleIndex].subModules[subModuleIndex].permissions;
          for (let permissionIndex = 0; permissionIndex < this.filtredMenu[moduleIndex].subModules[subModuleIndex].items.length; permissionIndex++) {
            this.filtredMenu[moduleIndex].subModules[subModuleIndex].items[permissionIndex].label = this.translate.instant(this.filtredMenu[moduleIndex].subModules[subModuleIndex].items[permissionIndex].code);
            this.filtredMenu[moduleIndex].subModules[subModuleIndex].items[permissionIndex].isChecked = false;
          }
       }
      }
      if(this.listOfCheckedPermissions.length!=0){
          for(let moduleIndex=0; moduleIndex< this.filtredMenu.length; moduleIndex++){
            const module:Module = this.filtredMenu[moduleIndex];
            for(let subModuleIndex=0; subModuleIndex< this.filtredMenu[moduleIndex].subModules.length; subModuleIndex++){
              const subModule:SubModule = module.subModules[subModuleIndex];
              for(let permissionIndex=0; permissionIndex<subModule.permissions.length; permissionIndex++){
                const permission:Permission = subModule.permissions[permissionIndex];
                if(this.listOfCheckedPermissions.indexOf(permission.id)>-1){
                  permission.isChecked=true;
                  module.isChecked=true;
                  subModule.isChecked=true;
                }
              }
            }
          }
       }
    }else {
      this.searching = false ;
      for (let moduleIndex = 0; moduleIndex < this.modules.length; moduleIndex++) {
        this.modules[moduleIndex].label = this.translate.instant(this.modules[moduleIndex].code);
        this.modules[moduleIndex].isChecked = false;
        if(this.modules[moduleIndex].subModules.length != 0) {
          this.modules[moduleIndex].items = this.modules[moduleIndex].subModules;
        }
        for (let subModuleIndex = 0; subModuleIndex < this.modules[moduleIndex].subModules.length; subModuleIndex++) {
          this.modules[moduleIndex].subModules[subModuleIndex].label = this.translate.instant(this.modules[moduleIndex].subModules[subModuleIndex].code);
          this.modules[moduleIndex].subModules[subModuleIndex].isChecked = false;
          this.modules[moduleIndex].subModules[subModuleIndex].items = this.modules[moduleIndex].subModules[subModuleIndex].permissions;
          for (let permissionIndex = 0; permissionIndex < this.modules[moduleIndex].subModules[subModuleIndex].items.length; permissionIndex++) {
            this.modules[moduleIndex].subModules[subModuleIndex].items[permissionIndex].label = this.translate.instant(this.modules[moduleIndex].subModules[subModuleIndex].items[permissionIndex].code);
            this.modules[moduleIndex].subModules[subModuleIndex].items[permissionIndex].isChecked = false;
          }
        }
      }
      if(this.listOfCheckedPermissions.length!=0){
        for(let moduleIndex=0; moduleIndex< this.modules.length; moduleIndex++){
          const module:Module = this.modules[moduleIndex];
          for(let subModuleIndex=0; subModuleIndex< this.modules[moduleIndex].subModules.length; subModuleIndex++){
            const subModule:SubModule = module.subModules[subModuleIndex];
            for(let permissionIndex=0; permissionIndex<subModule.permissions.length; permissionIndex++){
              const permission:Permission = subModule.permissions[permissionIndex];
              if(this.listOfCheckedPermissions.indexOf(permission.id)>-1){
                permission.isChecked=true;
                module.isChecked=true;
                subModule.isChecked=true;
              }
            }
          }
         }
      }
    }
  }
}
function RoleConfigCategoryTreeviewComponent(RoleConfigCategoryTreeviewComponent: any) {
  throw new Error('Function not implemented.');
}

