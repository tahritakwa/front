import {Component, ComponentRef, OnDestroy, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {isNumeric, ValidationService} from '../../../shared/services/validation/validation.service';
import {MeasureUnit} from '../../../models/inventory/measure-unit.model';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {MeasureUnitService} from '../../../shared/services/mesure-unit/measure-unit.service';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import {UnitOfMesureJavaService} from '../../../manufacturing/service/unit-of-mesure-java-service.service';

const ACTIVE_LIST_URL = '/main/inventory/list-Measure-Unit/';

@Component({
  selector: 'app-add-measure-unit',
  templateUrl: './add-measure-unit.component.html',
})
export class AddMeasureUnitComponent implements OnInit, OnDestroy {

  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  /**
   * Form Group
   */
  measureUnitFormGroup: FormGroup;

  // predicate
  public predicate: PredicateFormat;


  public MeasureUnitSaved = false;
  public measureUnit: MeasureUnit;

  /*
   * Id Entity
   */
  private id: number;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;

  private measureSubscription: Subscription;

  /*
   * measure to update
   */
  private measureUnitToUpdate: MeasureUnit;

  /**
     * If modal=true
     */
  public isModal: boolean;


  /*
   * id Subscription
   */
  private idSubscription: Subscription;
  activeDecomposable: boolean = false;
  public hasAddMeasureUnitPermission: boolean;
  public hasUpdateMeasureUnitPermission: boolean;
  public hasProductionPermission = false;


  constructor(private measureUnitService: MeasureUnitService, private fb: FormBuilder, private validationService: ValidationService,
    private modalService: ModalDialogInstanceService, private swalWarrings: SwalWarring, private authService: AuthService,
    private activatedRoute: ActivatedRoute,private styleConfigService: StyleConfigService,   private unitOfMesureJavaService: UnitOfMesureJavaService,
    private router: Router) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });
  }

  ngOnInit() {
    this.hasAddMeasureUnitPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_MEASUREUNIT);
    this.hasUpdateMeasureUnitPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_MEASUREUNIT);
    this.hasProductionPermission =
      this.authService.hasAuthorities([PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_EDIT_GAMME_PERMISSION]);
    this.createAddForm();
    this.measureUnitFormGroup.controls['DigitsAfterComma'].disable();
    this.isUpdateMode = this.id > 0;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }


  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
  }


  /**
     * create main form
     */
  private createAddForm(): void {
    this.measureUnitFormGroup = new FormGroup({
      Id : new FormControl(0),
      MeasureUnitCode: new FormControl('', Validators.required),
      Label: new FormControl('', Validators.required),
      Description: new FormControl('', Validators.required),
      IsDecomposable: new FormControl(false),
      DigitsAfterComma: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(10), isNumeric()])

    });
  }

  private preparePredicate() {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(SharedConstant.ID, Operation.eq, this.id));

    return predicate;
  }

  /**
  *  get data to update
  * */
  private getDataToUpdate(): void {

  //  if(this.dialogOptions && this.dialogOptions === SharedConstant.GAMME)
    this.measureSubscription = this.measureUnitService.getModelByCondition(this.preparePredicate()).subscribe(data => {
      this.measureUnitToUpdate = data;

      if (this.measureUnitToUpdate) {
        this.measureUnitToUpdate.IsDecomposable?this.measureUnitFormGroup.controls['DigitsAfterComma'].enable():this.measureUnitFormGroup.controls['DigitsAfterComma'].disable();
        this.measureUnitFormGroup.patchValue(this.measureUnitToUpdate);
        this.activeDecomposable = this.measureUnitToUpdate.IsDecomposable;
      }
      if (!this.hasUpdateMeasureUnitPermission) {
           this.measureUnitFormGroup.disable();
      }
    });
  }

  activateDecomposable() {
    this.activeDecomposable = !this.activeDecomposable;
    if(this.activeDecomposable){
      this.measureUnitFormGroup.controls['DigitsAfterComma'].enable();
    } else{
      this.measureUnitFormGroup.controls['DigitsAfterComma'].setValue(0);
      this.measureUnitFormGroup.controls['DigitsAfterComma'].disable();
    }
    this.measureUnitFormGroup.controls['IsDecomposable'].setValue(this.activeDecomposable);
  }

  /**
* Save click
*/
  public onAddMeasureClick(): void {


    if (this.measureUnitFormGroup.valid) {

      if(this.isModal){

        if(this.dialogOptions && this.dialogOptions.data && this.dialogOptions.data.source === SharedConstant.GAMME){
          this.unitOfMesureJavaService.getJavaGenericService().saveEntity(this.convertToJavaModel(this.measureUnitFormGroup.value), '').subscribe((data) => {
            this.MeasureUnitSaved = true;
            this.dialogOptions.data = data;
            this.dialogOptions.onClose();
            this.modalService.closeAnyExistingModalDialog();
          });
        } else {
          this.measureUnitService.save(this.measureUnitFormGroup.value, true, null, null, null, true).subscribe((data) => {

            this.MeasureUnitSaved = true;
            this.dialogOptions.data = data;
            this.dialogOptions.onClose();
            this.modalService.closeAnyExistingModalDialog();
          });
        }

      }else{
        if (!this.MeasureUnitSaved && !this.isUpdateMode) {

          this.measureUnitService.save(this.measureUnitFormGroup.value, !this.isUpdateMode).subscribe((data) => {

            this.MeasureUnitSaved = true;
            this.backToPrevious();
          });

        } else if (!this.MeasureUnitSaved && this.isUpdateMode) {
          if (this.measureUnitFormGroup.touched) {

            this.measureUnitService.save(this.measureUnitFormGroup.value).subscribe(() => {
              this.backToPrevious();
            });
          }
        }
      }

    } else {

      this.validationService.validateAllFormFields(this.measureUnitFormGroup);
    }
  }


  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.measureSubscription) {
      this.measureSubscription.unsubscribe();
    }
  }
  backToPrevious() {
    if (!this.isModal) {
      this.router.navigate([ACTIVE_LIST_URL]);
    } else {
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
  }

  getFooterClass() {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  convertToJavaModel(value) {

    return {
      id: value.Id,
      code: value.MeasureUnitCode ,
      label: value.Label ,
      description: value.Description,
    };
  }
}
