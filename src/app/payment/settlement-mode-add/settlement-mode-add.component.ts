import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';
import { PredicateFormat, Relation, Filter, Operation } from '../../shared/utils/predicate';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { PricesConstant } from '../../constant/sales/prices.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { PricesService } from '../../sales/services/prices/prices.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { PaymentConstant } from '../payment.constant';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { unique, ValidationService } from '../../shared/services/validation/validation.service';
import { min } from 'rxjs/operators';
import { PaymentMethod } from '../../models/payment-method/payment-method.model';
import { DetailsPaymentMode } from '../../models/payment/details-payment-mode';
import { SettlementMethodService } from '../services/payment-method/settlement-method.service';
import { PaymentDropdownComponent } from '../../shared/components/payment-dropdown/payment-dropdown.component';
import { GrowlService } from '../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { PaymentMode } from '../../models/payment/payment-mode';
import { FileInfo } from '../../models/shared/objectToSend';
import { DetailsSettlementModeService } from '../services/payment-method/DetailsSettlementMode.service';
import { FormModalDialogService } from '../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { PaymentMethodAddComponent } from '../payment-method/payment-method-add.component';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { NumberConstant } from '../../constant/utility/number.constant';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import {TaxeGroupConstant} from '../../constant/Administration/taxe-group.constant';
import {Observable} from 'rxjs/Observable';
import {StyleConfigService} from '../../shared/services/styleConfig/style-config.service';
import { SettlementConstant } from '../../constant/payment/settlement.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';

const ID = 'id';
const LOGIC_AND = 'and';
@Component({
  selector: 'app-add-settlement-mode',
  templateUrl: './settlement-mode-add.component.html',
  styleUrls: ['./settlement-mode-add.component.scss']
})
export class SettlementModeAddComponent implements OnInit, IModalDialog {
  // Action Mode
  isUpdateMode = false;
  // Form Group
  addSettlementFormGroup: FormGroup;
  isModal: boolean;
  // Observation Files
  public ObservationsFilesToUpload: Array<FileInfo>;
  // idPaymentMode => =0 if is an add operation or id if it's an update Mode
  idPaymentMode: number;
  // Current Price
  PaymentModeToUpdate: PaymentMode;
  // Form Group
  formGroup: FormGroup;
  @ViewChild(PaymentDropdownComponent) paymentDropdownComponent;
  dataDetailsPayment: DetailsPaymentMode[] = [];
  dataToSend: PaymentMode;
  data: DetailsPaymentMode[] = [];
  private btnEditVisible: boolean;
  // button add item to the list clicked and not closed
  private isAddItemNotClosed = false;
  typeOfPaymentsSelectedText: string;
  paymentModeSelectedText: string;
  // Edited Row index
  private editedRowIndex: number;

  public paymentDC: PaymentDropdownComponent;

  // PriceId => =0 if is an add operation or id if it's an update Mode
  idPaymentMethod: number;
  public hasAddSettlementModePermission: boolean;
  public hasUpdateSettlementModePermission: boolean;
  public typeOfPaymentsFiltred;
  public typeOfPayment;
  public typeOfPayments: Array<{ text: string, value: number }> = [{ text: 'Comptant', value: 2 }, { text: 'Fin de mois', value: 3 },
  { text: 'Net', value: 5 }, { text: 'Net le', value: 6 }];
  public saveIdPaymentMethod: Array<string> = [];
  public saveIdSettlementType: Array<string> = [];

  public typeSettlement: string;
  public settlementModelisturl = SharedConstant.SETTLEMENT_MODE_LIST_URL;

  // pager settings
  pagerSettings: PagerSettings = {
    buttonCount: 10, info: true, type: 'numeric', pageSizes: true, previousNext: true
  };
  public predicate: PredicateFormat;
  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: LOGIC_AND,
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: PaymentConstant.PERCENTAGE_FIELD,
      title: PaymentConstant.PERCENTAGE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_THIRTY
    },
    {
      field: PaymentConstant.PAYMENT_MODE_FIELD,
      title: PaymentConstant.PAYMENT_MODE,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_TWENTY
    },
    {
      field: PaymentConstant.TYPE_OF_PAYMENT_FIELD,
      title: PaymentConstant.TYPE_OF_PAYMENT,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_TWENTY
    },
    {
      field: PaymentConstant.NUMBER_OF_DAYS_FIELD,
      title: PaymentConstant.NUMBER_OF_DAYS,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: PaymentConstant.DAY_OF_SETTLEMENT_FIELD,
      title: PaymentConstant.DAY_OF_SETTLEMENT,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: PaymentConstant.COMPLETION_OF_PRINTING_FIELD,
      title: PaymentConstant.COMPLETION_OF_PRINTING,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  constructor(private fb: FormBuilder, public settlementMethodService: SettlementMethodService, private swalWarrings: SwalWarring
    , private router: Router, private validationService: ValidationService, private translate: TranslateService,
    private growlService: GrowlService, private activatedRoute: ActivatedRoute,
    private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef,
    private detailsSettlementModeService: DetailsSettlementModeService, private authService: AuthService,
    private modalService: ModalDialogInstanceService,private styleConfigService: StyleConfigService) {
    this.ObservationsFilesToUpload = new Array<FileInfo>();
    this.activatedRoute.params.subscribe(params => { this.idPaymentMode = +params[ID] || 0; });
  }
  /**
   * create main form
   */
  private createAddForm(): void {
    this.addSettlementFormGroup = this.fb.group({
      Code: ['', Validators.required],
      Label: ['', [Validators.required]],
      DetailsSettlementMode: [''],
      Id: [0]
    });
  }

  /**
* Build PaymentMethods form
*/
  private buildDetailsPaymentModeForm(): FormGroup {
    this.formGroup = this.fb.group({
      Percentage: ['', {validators: [Validators.required, Validators.min(0), Validators.max(100)], updateOn: 'blur'}],
      IdPaymentMethod: [NumberConstant.ZERO, {validators: Validators.required, updateOn: 'blur'}],
      IdSettlementType: [NumberConstant.ZERO, {validators: Validators.required, updateOn: 'blur'}],
      NumberDays: ['', {validators: [Validators.required, Validators.min(0)], updateOn: 'blur'}],
      SettlementDay: ['', {validators: Validators.min(0), updateOn: 'blur'}],
      CompletePrinting: [''],
      Code: [''],
      Label: [''],
      Id: [0],
      IdSettlementMode: [''],
      LabelSettlementType: [''],
      IsDeleted: [false],
      MethodNamePaymentMethod: ['']
    });
    return this.formGroup;
  }

  public valueChange(typeOfPayment): void {
    this.typeOfPayment = typeOfPayment;
    if(typeOfPayment.value == NumberConstant.SIX){
      this.formGroup.controls['SettlementDay'].setValidators([Validators.min(0) ,Validators.required]);
    } else {
      this.formGroup.controls['SettlementDay'].setValidators(Validators.min(0));
    }
this.formGroup.controls['SettlementDay'].updateValueAndValidity();
  }
  public selectionChange(typeOfPayment): void {
  }

  ngOnInit() {
    this.hasAddSettlementModePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_SETTLEMENTMODE);
    this.hasUpdateSettlementModePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_SETTLEMENTMODE);
    this.createAddForm();
    this.preparePredicate();
    this.typeOfPaymentsFiltred = this.typeOfPayments;
    this.isUpdateMode = this.idPaymentMode > 0;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    } else {
      this.initGridDataSource();
    }
  }

  /**
 * Get Item to update
 */
  private getDataToUpdate() {
    this.settlementMethodService.getById(this.idPaymentMode).subscribe(data => {
      this.PaymentModeToUpdate = data;
      data.IdCurrency = data.IdUsedCurrency;
      data.StartDate = new Date(data.StartDate);
      data.EndDate = new Date(data.EndDate);
      this.detailsSettlementModeService.callPredicateData(this.predicate).subscribe(y => {
        y.forEach(element => {
          element.MethodNamePaymentMethod = element.IdPaymentMethodNavigation.MethodName;
          element.LabelSettlementType = element.IdSettlementTypeNavigation.Label;
          element.IdPaymentMethodNavigation = null;
          element.IdSettlementTypeNavigation = null;
          this.dataDetailsPayment.push(element);
        });
        this.data = this.dataDetailsPayment.filter(x => x.IsDeleted !== true);
        this.addSettlementFormGroup.patchValue(data);
        this.ObservationsFilesToUpload = data.ObservationsFilesInfo;
      });
      if (!this.hasUpdateSettlementModePermission) {
        this.addSettlementFormGroup.disable();
      }
    });
  }

  /**
 * Quick add
 * @param param0
 */
  public addHandler({ sender }) {
    this.isAddItemNotClosed = true;
    this.closeEditor(sender);
    sender.addRow(this.buildDetailsPaymentModeForm());
  }

  /**
 * Cancel
 * @param param0
 */
  public cancelHandler({ sender, rowIndex }) {
    this.isAddItemNotClosed = false;
    this.closeEditor(sender, rowIndex);
  }

  /**
   * Close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.formGroup = undefined;
    }
  }

  /**
   * prepare filters and relationships
   */
  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(PaymentConstant.ID_SETTLEMENT_MODE, Operation.eq, this.idPaymentMode));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push(new Relation(PaymentConstant.ID_PAYMENT_METHODE_NAVIGATION));
    // Add relation IdWarehouseSourceNavigation
    this.predicate.Relation.push(new Relation(PaymentConstant.ID_SETTLEMENT_TYPE_NAVIGATION));
  }

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource() {
    this.settlementMethodService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.settlementMethodService.reloadServerSideData(state, this.predicate)
      .subscribe(data => this.gridSettings.gridData = data);
  }

  /**
   * Delete Price
   * @param param0
   */
  public removeHandler({ sender, rowIndex, isNew, dataItem }) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        if (dataItem.Id === NumberConstant.ZERO) {
          this.dataDetailsPayment.splice(rowIndex, 1);
        } else {
          dataItem.IsDeleted = true;
          this.dataDetailsPayment[rowIndex] = dataItem;
        }
        this.data = this.dataDetailsPayment.filter(x => x.IsDeleted !== true);
      }
    });
  }


  /**
   * Save row for the TaxeGroupConfig data
   * @param param
   */
  public saveHandler({ sender, rowIndex, isNew }) {
    const selectedTypeOfPayment =  this.typeOfPayments.find(x => x.value
      === this.formGroup.controls[PaymentConstant.ID_SETTLEMENT_TYPE].value);
    this.typeOfPaymentsSelectedText = selectedTypeOfPayment ? selectedTypeOfPayment.text : undefined;
    const selectedPaymentMode = this.paymentDropdownComponent.paymentMethodDataSource
      .find(x => x.Id === this.formGroup.controls[PaymentConstant.ID_PAYMENT_METHODE].value);
    this.paymentModeSelectedText = selectedPaymentMode ? selectedPaymentMode.MethodName : undefined;
    this.formGroup.controls[PaymentConstant.LABEL_SETTLEMNT_TYPE].setValue(this.typeOfPaymentsSelectedText);
    this.formGroup.controls[PaymentConstant.METHOD_NAME_PAYMENT_METHODE].setValue(this.paymentModeSelectedText);
    if (this.formGroup.valid && selectedTypeOfPayment && selectedPaymentMode) {
      if (isNew) {
        this.dataDetailsPayment.splice(NumberConstant.ZERO, NumberConstant.ZERO, this.formGroup.getRawValue());
      } else {
        this.dataDetailsPayment[rowIndex] = this.formGroup.getRawValue();
      }
      sender.closeRow(rowIndex);
      this.data = this.dataDetailsPayment.filter(x => x.IsDeleted !== true);
      if (this.isAddItemNotClosed) {
        this.isAddItemNotClosed = false;
      }
    } else if (!selectedPaymentMode) {
      this.growlService.ErrorNotification(this.translate.instant(SettlementConstant.PAYMENT_MODE_MISSING));
    } else if (!selectedTypeOfPayment) {
      this.growlService.ErrorNotification(this.translate.instant(SettlementConstant.TYPE_OF_PAYMENT_MISSING));
    } else {
      this.validationService.validateAllFormFields(this.formGroup as FormGroup);
    }
  }

  saveChanges() {
    this.addSettlementFormGroup.controls[PaymentConstant.DETAILS_SETTLEMENT_MODE].setValue(this.dataDetailsPayment);
    if (this.isModal) {
      // Add Mode with modal
      this.settlementMethodService.save(this.addSettlementFormGroup.getRawValue(), true).subscribe(payment => {
        this.dataToSend = payment;
        this.settlementMethodService.show(this.dataToSend);
        this.modalService.closeAnyExistingModalDialog();
      });
    } else {
      if(this.addSettlementFormGroup.valid){
      if (this.idPaymentMode > PaymentConstant.MIN_VALUE) {
        // Update Mode
        this.settlementMethodService.save(this.addSettlementFormGroup.getRawValue(), false).subscribe(x => {
          this.isSaveOperation = true;
          this.router.navigateByUrl(PaymentConstant.SETTLEMENT_METHOD_LIST_URL);
        });
      } else {
        // Add Mode
        this.settlementMethodService.save(this.addSettlementFormGroup.getRawValue(), true).subscribe(x => {
          this.isSaveOperation = true;
          this.router.navigateByUrl(PaymentConstant.SETTLEMENT_METHOD_LIST_URL);
        });
      }
    }else{
      this.validationService.validateAllFormFields(this.addSettlementFormGroup);
    }
  }
  }

  public save() {
    let verifTotalPercentage = NumberConstant.ZERO;
    for (let i = NumberConstant.ZERO; i < this.dataDetailsPayment.length; i++) {
      if (!this.dataDetailsPayment[i].IsDeleted) {
        verifTotalPercentage += Number(this.dataDetailsPayment[i].Percentage);
      }
    }
    if (verifTotalPercentage === NumberConstant.ONE_HUNDRED) {
      this.saveChanges();
    } else {
      this.growlService.ErrorNotification(this.translate.instant(PaymentConstant.ERROR_SUM_PERCENTAGE));
    }
  }


  /**
   * Go the Update Price page
   * @param $event
   */
  editHandler({ sender, rowIndex, dataItem }) {
    if (this.isAddItemNotClosed) {
      this.closeEditor(sender, NumberConstant.MINUS_ONE);
    }
    this.closeEditor(sender);
    this.buildDetailsPaymentModeForm();
    this.formGroup.patchValue(dataItem);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
    this.isAddItemNotClosed = false;
  }

  openPaymentModal($event) {
    const modalTitle = this.translate.instant('ADD_PAYMENT_MODE');
    this.formModalDialogService.openDialog(modalTitle, PaymentMethodAddComponent,
      this.viewRef, this.cancel.bind(this), null, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  cancel() {
    this.modalService.closeAnyExistingModalDialog();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
  }

  public backToList() {
    this.router.navigateByUrl(SharedConstant.SETTLEMENT_MODE_LIST_URL);
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
    return this.addSettlementFormGroup.touched;
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
  public handleFilter(value: string) : void{
    this.typeOfPaymentsFiltred = this.typeOfPayments.filter((s) =>
      s.text.toLowerCase().includes(value.toLowerCase()));
  }
}
