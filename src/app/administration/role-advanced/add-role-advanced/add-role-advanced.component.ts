import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoleConstant } from '../../../constant/Administration/role.constant';
import { PredicateFormat, Filter, Relation, Operation } from '../../../shared/utils/predicate';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { RoleService } from '../../services/role/role.service';
import { RoleTreeviewComponent } from '../../components/role-treeview/role-treeview.component';
import { ModuleByRole } from '../../../models/administration/module-by-role.model';
import { FunctionnalityByRole } from '../../../models/administration/functionnality-by-role.model';
import { ModuleByRoleService } from '../../services/module/module.service';
import { Role } from '../../../models/administration/role.model';

@Component({
  selector: 'app-add-role-advanced',
  templateUrl: './add-role-advanced.component.html',
  styleUrls: ['./add-role-advanced.component.scss']
})
export class AddRoleAdvancedComponent implements OnInit {
   /* Form Group */
   checkedKeysForModules: any[] = [];
   checkedKeysForFunctionnalities: any[] = [];
   roleFormGroup: FormGroup;
   moduleData: ModuleByRole[] = new Array<ModuleByRole>();
   functionnalityData: FunctionnalityByRole[] = new Array<FunctionnalityByRole>();
   allFunctionnalityData: FunctionnalityByRole[] = new Array<FunctionnalityByRole>();
   isUpdateMode: boolean;
   predicate: PredicateFormat;
   private id: number;
   @ViewChild(RoleTreeviewComponent) private treeViewRole: RoleTreeviewComponent;

   constructor(private fb: FormBuilder,
     public roleService: RoleService,
     public moduleByRoleService: ModuleByRoleService,
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
     this.predicate.Relation = new Array<Relation>();
     this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RoleConstant.MODULE_BY_ROLE)]);
   }

   private getDataToUpdate(): void {
     this.roleService.getById(this.id).subscribe(data => {
       this.roleFormGroup.patchValue(data);
       this.initalizeModulesAndFunctionnalities();
     });

   }

   /* Prepare Add form component  */
   private createAddForm(): void {
     this.roleFormGroup = this.fb.group({
       Id: [this.id || 0],
       Code: ['', Validators.required],
       RoleName: ['', Validators.required]
     });
   }

   saveRole() {
     if (this.roleFormGroup.valid) {
       const valueToSave = this.roleFormGroup.value as Role;
       valueToSave.FunctionalityByRole = this.allFunctionnalityData;
       valueToSave.ModuleByRole = this.moduleData;
       if (this.isUpdateMode) {
         this.roleService.save(valueToSave, false).subscribe(data => {
           this.router.navigate([RoleConstant.URL_ROLE_ADVANCED_LIST],
             { skipLocationChange: true });
         });
       } else {
         this.roleService.save(valueToSave, true).subscribe(() => {
           this.router.navigate([RoleConstant.URL_ROLE_ADVANCED_LIST], { skipLocationChange: true });
         });
       }
     } else {
       this.validationService.validateAllFormFields(this.roleFormGroup);
     }
   }

   initalizeModulesAndFunctionnalities() {
     this.preparePredicate();
     this.moduleByRoleService.getModulesByRoleConfig(this.predicate).subscribe(data => {
       this.moduleData = data;
       if (this.isUpdateMode) {
         this.treeViewRole.moduleData = data;
         this.treeViewRole.initListOfModule();
       }
     });
     this.moduleByRoleService.getFunctionnalitiesByRoleConfig(this.predicate).subscribe(data => {
       this.allFunctionnalityData = data;
       if (this.isUpdateMode) {
         this.treeViewRole.allFunctionnalityData = data;
         this.treeViewRole.initListOfModule();
       }
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
}
