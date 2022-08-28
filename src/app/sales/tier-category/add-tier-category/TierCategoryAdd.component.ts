import { DocumentConstant } from './../../../constant/sales/document.constant';
import { Observable } from 'rxjs/Observable';
import { NumberConstant } from './../../../constant/utility/number.constant';
import { SharedConstant } from './../../../constant/shared/shared.constant';
import { PermissionConstant } from './../../../Structure/permission-constant';
import { AuthService } from './../../../login/Authentification/services/auth.service';
import { SwalWarring } from './../../../shared/components/swal/swal-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { StyleConfigService } from './../../../shared/services/styleConfig/style-config.service';
import { unique, ValidationService } from './../../../shared/services/validation/validation.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { TierCategoryService } from './../../services/tier-category/tier-category.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TierCategory } from './../../../models/sales/tier-category.model';
import { Subscription } from 'rxjs';
import { IModalDialogOptions ,IModalDialog } from 'ngx-modal-dialog';
import { Component, OnInit, ComponentRef } from '@angular/core';



@Component({
  selector: 'app-TierCategoryAdd',
  templateUrl: './TierCategoryAdd.component.html',
  styleUrls: ['./TierCategoryAdd.component.css']
})
export class TierCategoryAddComponent implements OnInit{

  /**
   * If modal=true
   */
   public isModal: boolean;

   /**
    * dialog subject
    */
   options: Partial<IModalDialogOptions<any>>;
   /**/
 
   /*
    * Id Entity
    */
   private id: number;
 
   /*
    * is updateMode
    */
   public isUpdateMode = false;
 /**
    * attribute to use while verifying the route leave
    */
   private isSaveOperation = false;
 
   private currencySubscription: Subscription;
 
   /*
    * id Subscription
    */
   private idSubscription: Subscription;
   public TIER_CATEGORY_LIST_URL = "/main/settings/sales/list-tier-categorys";
   tierCategoryToUpdate: TierCategory;
   idTierCategory: number;
   addTierCategoryFormGroup: FormGroup;
   public hasAddTierCategoryPermission: boolean;
   public hasUpdateTierCategoryPermission: boolean;
   constructor(
     private fb: FormBuilder,
     private tierCategoryService: TierCategoryService,
     private modalService: ModalDialogInstanceService,
     private validationService: ValidationService,
     private styleConfigService: StyleConfigService,
     private activatedRoute: ActivatedRoute,
     private swalWarring: SwalWarring,
     private authService: AuthService,
     private router: Router
   ) { }
 
   ngOnInit() {
     this.hasAddTierCategoryPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_TIER_CATEGORY);
     this.hasUpdateTierCategoryPermission =
     this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_TIER_CATEGORY);
     this.idSubscription = this.activatedRoute.params.subscribe((params) => {
       this.idTierCategory = !this.isModal ? +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO : NumberConstant.ZERO;
     });
     this.createAddForm();
     if (this.idTierCategory) {
       this.isUpdateMode = true;
       this.getDataToUpdate();
     }
   }
 
   /**
    * mode modal init
    * @param reference
    * @param options
    */
   dialogInit(
     reference: ComponentRef<IModalDialog>,
     options: Partial<IModalDialogOptions<any>>
   ) {
     this.isModal = true;
     this.options = options;
   }
 
   /**
    * on destroy
    * */
   ngOnDestroy(): void {
     if (this.idSubscription) {
       this.idSubscription.unsubscribe();
     }
     if (this.currencySubscription) {
       this.currencySubscription.unsubscribe();
     }
   }
 
   private createAddForm(): void {
     this.addTierCategoryFormGroup = this.fb.group({
       Id: [0],
       Code: ["", Validators.required],
       Name: ["", Validators.required]
     });
   }
   private getDataToUpdate() {
     this.tierCategoryService.getById(this.idTierCategory).subscribe((data) => {
       this.tierCategoryToUpdate = data;
       this.addTierCategoryFormGroup.patchValue(this.tierCategoryToUpdate);
    
       if (!this.hasUpdateTierCategoryPermission) {
         this.addTierCategoryFormGroup.disable();
       }
     });
   }
   public onAddTierCategoryClick() {
     if ((this.addTierCategoryFormGroup as FormGroup).valid) {
       this.isSaveOperation = true;
       const TierCategoryToSave = this.addTierCategoryFormGroup.getRawValue() as TierCategory;
       if (this.idTierCategory) {
        TierCategoryToSave.Id = this.idTierCategory;
       }
       if (this.isModal) {
         this.tierCategoryService
           .save(TierCategoryToSave, true,null,null,null,true)
           .subscribe((data) => {
             if (data) {
               this.options.data = data;
               this.options.onClose();
               this.modalService.closeAnyExistingModalDialog();
             }
           });
       } else {
         this.tierCategoryService
           .save(TierCategoryToSave, !this.isUpdateMode)
           .subscribe((data) => {
             if (data) {
               this.router.navigate([this.TIER_CATEGORY_LIST_URL]);
             }
           });
       }
     } else {
       this.validationService.validateAllFormFields(this.addTierCategoryFormGroup);
     }
   }
  
   /**
    * this method will be called by CanDeactivateGuard service to check the leaving component possibility
    */
   canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
     if (this.isSaveOperation) {
       this.isSaveOperation = false;
       return true;
     }
     return this.validationService.handleCanDeactivateToLeaveCurrentComponent(
       this.isFormGroupChanged.bind(this)
     );
   }
 
   private isFormGroupChanged(): boolean {
     return this.addTierCategoryFormGroup.touched;
   }
 
   get CodeProduct(): FormControl {
    return this.addTierCategoryFormGroup.get(SharedConstant.CODE) as FormControl;
  }

   get Name(): FormControl {
     return this.addTierCategoryFormGroup.get(DocumentConstant.CATEGORY_TIER_NAME) as FormControl;
   }
 
   getFooterClass() {
     return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
   }

}
