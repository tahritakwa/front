import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoleConfigConstant } from '../../../constant/Administration/role-config.constant';
import { PredicateFormat, Filter, Relation, Operation } from '../../../shared/utils/predicate';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ModuleByRole } from '../../../models/administration/module-by-role.model';
import { ModuleByRoleService } from '../../services/module/module.service';
import { RoleConfig } from '../../../models/administration/role-config.model';
import { RoleConfigService } from '../../services/role-config/role-config.service';
import { ModuleConfig } from '../../../models/administration/module-config.model';
import { FunctionnalityConfig } from '../../../models/administration/functionnality-config.model';
import { isNullOrUndefined } from 'util';
import { ModuleConfigService } from '../../services/module-config/module-config.service';
import { RoleRoleConfigTreeviewComponent } from '../../components/role-role-config-treeview/role-role-config-treeview.component';

@Component({
  selector: 'app-add-role-config',
  templateUrl: './add-role-config.component.html',
  styleUrls: ['./add-role-config.component.scss']
})
export class AddRoleConfigComponent implements OnInit {
   /* Form Group */
   checkedKeysForModules: any[] = [];
   checkedKeysForFunctionnalities: any[] = [];
   roleFormGroup: FormGroup;
   moduleData: ModuleConfig[] = new Array<ModuleConfig>(); //ModuleByRole
   functionnalityData: FunctionnalityConfig[] = new Array<FunctionnalityConfig>(); //IsToCheckModule
   allFunctionnalityData: FunctionnalityConfig[] = new Array<FunctionnalityConfig>();
   allFunctionnalityConfigData: FunctionnalityConfig[] = new Array<FunctionnalityConfig>();
   allModuleConfigData: ModuleConfig[] = new Array<ModuleConfig>();
   isUpdateMode: boolean;
   predicate: PredicateFormat;
   private id: number;
   @ViewChild(RoleRoleConfigTreeviewComponent) private treeViewRole: RoleRoleConfigTreeviewComponent;

   constructor(private fb: FormBuilder,
     public roleConfigService: RoleConfigService,
     public moduleByRoleService: ModuleByRoleService,
     public moduleByRoleConfigService: ModuleConfigService,
     private activatedRoute: ActivatedRoute,
     private router: Router, private validationService: ValidationService) {
     this.activatedRoute.params.subscribe(params => {
       this.id = +params['id'] || 0;
     });
   }
   private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter('Id', Operation.eq, this.id));
  }

  private IntializePredicate(): void {
    this.predicate = new PredicateFormat();
  }


/* Prepare Add form component  */
  private createAddForm(): void {
    this.roleFormGroup = this.fb.group({
      Id: [this.id || 0],
      Code: ['', Validators.required],
      RoleName: ['', Validators.required],
      IdRoleConfigCategory: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.createAddForm();
    this.isUpdateMode = this.id > 0;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    } else {
      this.initalizeModulesAndFunctionnalities();
    }
  }

  initalizeModulesAndFunctionnalities() {
    this.preparePredicate();
    this.moduleByRoleService.getModulesByRoleConfig(this.predicate).subscribe(data => {
      this.moduleData = data;
      if (this.isUpdateMode) {
        this.moduleData = data;
        this.treeViewRole.initListOfModule();
      }
    });
    this.moduleByRoleService.getFunctionnalitiesByRoleConfig(this.predicate).subscribe(data => {
      this.allFunctionnalityData = data;
      if (this.isUpdateMode) {
        this.allFunctionnalityData = data;
        this.treeViewRole.initListOfModule();
      }
    });
  }

  private getDataToUpdate(): void {
     this.roleConfigService.getById(this.id).subscribe(data => {
       this.roleFormGroup.patchValue(data);
       this.initalizeModulesAndFunctionnalitiesFromConfig();
     });

  }

  private prepareLoadConfigPredicateWithRelation(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter('Id', Operation.eq, this.id));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RoleConfigConstant.MODULE_CONFIG)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RoleConfigConstant.FUNCTIONALITY_CONFIG)]);
  }

   initalizeModulesAndFunctionnalitiesFromConfig() {

    this.prepareLoadConfigPredicateWithRelation();
    this.moduleByRoleConfigService.getModulesByRoleConfig(this.predicate).subscribe(modulesRelatedToRoleConfig => {
      const selectedChildrenModules = Array.prototype.concat.apply([], modulesRelatedToRoleConfig.map( val => val.ChildrenModule));
      const selectedParentModules = Array.prototype.concat.apply([],
         modulesRelatedToRoleConfig.map( val => {val.ChildrenModule = null; return val; } ));
      // contains the list of all modules related to the role config selected
      this.allModuleConfigData = Array.prototype.concat.apply(selectedChildrenModules, selectedParentModules);
      this.moduleByRoleConfigService.getFunctionnalitiesByRoleConfig(this.predicate).subscribe(FunctionalitiesRelatedToRoleConfig => {
            // the list of all functionality related to the role config
            this.allFunctionnalityConfigData = FunctionalitiesRelatedToRoleConfig;
            this.IntializePredicate();
            this.moduleByRoleService.getModulesByRoleConfig(this.predicate).subscribe(allModulesData => {
              this.moduleData = allModulesData;
              this.treeViewRole.moduleData = allModulesData;
              // this.treeViewRole.moduleData = this.allModuleConfigData;
              this.treeViewRole.checkHowIsTheActivesModules();
              this.treeViewRole.initListOfModule();
            });
            this.moduleByRoleService.getFunctionnalitiesByRoleConfig(this.predicate).subscribe(allFunctionalitiesData => {
              allFunctionalitiesData.forEach(funcData => {
                funcData.IsActive = FunctionalitiesRelatedToRoleConfig.find( x => x.IdFunctionality === funcData.IdFunctionality) ? true : false;
              });
                this.allFunctionnalityData = allFunctionalitiesData;

                this.treeViewRole.allFunctionnalityData = allFunctionalitiesData;
                // this.treeViewRole.allFunctionnalityData = this.allFunctionnalityConfigData;
                this.treeViewRole.checkHowIsTheActivesFunctionalities();
                this.treeViewRole.initListOfModule();
            });
      });
    });
  }


   saveRoleConfig() {
    if (this.roleFormGroup.valid) {
      const valueToSave = this.roleFormGroup.value as RoleConfig;
      valueToSave.ModuleConfig = new Array<ModuleConfig>();
      valueToSave.FunctionalityConfig = new Array<FunctionnalityConfig>();

      this.treeViewRole.allFunctionnalityData.forEach(funcconf => {
       if (funcconf.IsActive) {
          const newFuncConf = new FunctionnalityConfig();
          newFuncConf.IdFunctionality = funcconf.IdFunctionality;
          newFuncConf.IsActive = funcconf.IsActive;
          newFuncConf.IdRoleConfig = this.isUpdateMode === true ? this.id : 0;
          if (valueToSave.FunctionalityConfig != null  &&
            valueToSave.FunctionalityConfig.find(x => x.IdFunctionality === funcconf.IdFunctionality) === undefined) {
            valueToSave.FunctionalityConfig.push(newFuncConf);
          }
        }
      });

      this.treeViewRole.moduleData.forEach(parentmodconf => {
        if (parentmodconf.IsActive || parentmodconf.IsIndeterminate) {
         const newParentModConf = new ModuleConfig();
         newParentModConf.IdModule = parentmodconf.IdModule;
         newParentModConf.IsActive = parentmodconf.IsActive;
         newParentModConf.IdRoleConfig = this.isUpdateMode === true ? this.id : 0;
         valueToSave.ModuleConfig.push(newParentModConf);

         if (!isNullOrUndefined(parentmodconf.ChildrenModule)) {
           parentmodconf.ChildrenModule.forEach(childmodconf => {
             if (childmodconf.IsActive || childmodconf.IsIndeterminate) {
               const newChildModConf = new ModuleConfig();
               newChildModConf.IdModule = childmodconf.IdModule;
               newChildModConf.IsActive = childmodconf.IsActive;
               newChildModConf.IdRoleConfig = this.isUpdateMode === true ? this.id : 0;
               valueToSave.ModuleConfig.push(newChildModConf);
             }
           });
          }
        }
       });
       valueToSave.Code = valueToSave.Code.toString().trim();
       valueToSave.RoleName = valueToSave.RoleName.toString().trim();
      if (this.isUpdateMode) {
        this.roleConfigService.save(valueToSave, false).subscribe(data => {
          this.router.navigate([RoleConfigConstant.URL_ROLE_CONFIG_LIST],
            { skipLocationChange: true });
        });
      } else {
        this.roleConfigService.save(valueToSave, true).subscribe(() => {
          this.router.navigate([RoleConfigConstant.URL_ROLE_CONFIG_LIST],
            { skipLocationChange: true });
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.roleFormGroup);
    }
  }


}
