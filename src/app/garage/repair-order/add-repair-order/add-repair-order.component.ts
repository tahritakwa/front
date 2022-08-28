import { Component, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { StyleConstant } from '../../../constant/utility/style.constant';
import { Company } from '../../../models/administration/company.model';
import { Currency } from '../../../models/administration/currency.model';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { InterventionOrderTypeEnumerator } from '../../../models/enumerators/intervention-order-type.enum';
import { RepairOrderStateEnumerator } from '../../../models/enumerators/repair-order-state.enum';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { VehicleCategoryEnumerator } from '../../../models/enumerators/vehicle-category.enum';
import { OperationKit } from '../../../models/garage/operation-kit.model';
import { RepairOrderItem } from '../../../models/garage/repair-order-item.model';
import { RepairOrderOperation } from '../../../models/garage/repair-order-operation.model';
import { Item } from '../../../models/inventory/item.model';
import { RegistrationNumberOfVehicleDropdwonComponent } from '../../../shared/components/registration-number-of-vehicle-dropdwon/registration-number-of-vehicle-dropdwon.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FileService } from '../../../shared/services/file/file-service.service';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { OperationKitSelectedComponent } from '../../components/operation-kit-selected/operation-kit-selected.component';
import { OperationToBePerformedComponent } from '../../components/operation-to-be-performed/operation-to-be-performed.component';
import { OperationsProposedPopUpComponent } from '../../components/operations-proposed-pop-up/operations-proposed-pop-up.component';
import { InterventionService } from '../../services/intervention/intervention.service';
import { MileageService } from '../../services/mileage/mileage.service';
import { OperationKitService } from '../../services/operation-kit/operation-kit.service';
import { RepairOrderService } from '../../services/repair-order/repair-order.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { AddCustomerVehicleComponent } from '../../vehicle/customer-vehicle/add-customer-vehicle/add-customer-vehicle.component';

@Component({
  selector: 'app-add-repair-order',
  templateUrl: './add-repair-order.component.html',
  styleUrls: ['./add-repair-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddRepairOrderComponent implements OnInit {
  @ViewChild('registrationNumberChild') registrationNumberChild: RegistrationNumberOfVehicleDropdwonComponent;
  @ViewChild('operationToBePerformedChild') operationToBePerformedChild: OperationToBePerformedComponent;
  @Output() operationsChanged: EventEmitter<any> = new EventEmitter();
  repairOrderToUpdate: any;
  idRepairOrder: number;
  idWarehouse: number;
  idSelectedGarage: number;
  addRepairOrderFormGroup: FormGroup;
  repairOrderStatusEnumerator = RepairOrderStateEnumerator;
  interventionTypeEnumerator = InterventionOrderTypeEnumerator;
  public customerTiers = TiersTypeEnumerator.Customer;
  public vehicleCategory = VehicleCategoryEnumerator.Customer;
  public setBorderStyleForProposedOperation: string;
  public setBorderStyleForOperationToBePerformed: string;
  public setBorderStyleForSpareParts: string;
  public selectedMileage: string;
  public fieldsetBorderShowed = StyleConstant.BORDER_SOLID;
  public fieldsetBorderHidden = StyleConstant.BORDER_NONE;
  showMileageProgrammedDropdown: boolean;
  showProposedOperationGrid: boolean;
  hasUpdatePermission: boolean;
  public showProposedOperationContent = true;
  public showOperationToBePerformedContent = true;
  public showSparePartsContent = true;
  isOperationKitDisabled: boolean;
  isRepairOrderValid: boolean;
  showOperationKitDropdown: boolean;
  isUpdateMode: boolean;
  private saveDone = false;
  companyCurrency: Currency;
  language: string;
  hasSendMailPermission: boolean;

  selectedOperationKit: Array<OperationKit> = [];
  public listOperationFromOperationKit = [];
  public listItemFromOperationKit = [];
  public repairOrderItemList = [];
  public repairOrderOperationsList = [];
  public operationListIdsToIgnore = [];
  public buttonDropdownData: { 'type': string, 'value': string }[] = [
    { type: 'PRINT', value: this.translateService.instant('PRINT') },
    { type: 'MAIL', value: this.translateService.instant('SEND_MAIL') }
  ];
  constructor(private router: Router, private fb: FormBuilder, private mileageService: MileageService,
    private formModalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef,
    private operationKitService: OperationKitService, private growlService: GrowlService, private companyService: CompanyService,
    private translateService: TranslateService, private swalWarrings: SwalWarring, private interventionService: InterventionService,
    private repairOrderService: RepairOrderService, private validationService: ValidationService,
    private activatedRoute: ActivatedRoute, private authService: AuthService,
    private localStorageService: LocalStorageService, private userCurrentInformationsService: UserCurrentInformationsService, private fileService: FileService) {
    this.activatedRoute.params.subscribe(params => {
      this.idRepairOrder = +params[GarageConstant.ID] || NumberConstant.ZERO;
      this.isUpdateMode = this.idRepairOrder > NumberConstant.ZERO;
    });
    this.setBorderStyleForProposedOperation = this.fieldsetBorderShowed;
    this.setBorderStyleForOperationToBePerformed = this.fieldsetBorderShowed;
    this.setBorderStyleForSpareParts = this.fieldsetBorderShowed;
    this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.UPDATE_REPAIR_ORDER);
    this.companyService.getCurrentCompany().subscribe((data: Company) => {
      this.companyCurrency = data.IdCurrencyNavigation;
    });
    this.createAddRepairOrderFormGroup();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  createAddRepairOrderFormGroup() {
    this.addRepairOrderFormGroup = this.fb.group({
      Id: [0],
      IdTiers: [{ value: undefined, disabled: this.isUpdateMode }, Validators.required],
      IdVehicle: [undefined],
      IdGarage: [undefined, Validators.required],
      CurrentMileage: [undefined],
      RepairOrderType: [undefined],
      InterventionFor: [undefined],
      IdMileageProgrammed: [undefined],
      ListOperationKit: [undefined]
    });
  }

  saveAndGenerateQuotation() {
    if (this.addRepairOrderFormGroup.valid) {
      if (this.isRepairOrderNotEmpty()) {
        this.repairOrderToUpdate = Object.assign({}, this.repairOrderToUpdate, this.addRepairOrderFormGroup.getRawValue());
        this.repairOrderToUpdate.RepairOrderOperation = this.repairOrderOperationsList;
        this.repairOrderToUpdate.RepairOrderItem = this.repairOrderItemList;
        this.repairOrderToUpdate.ListIdOperationKit = this.getInterventionOperationKit();
        this.repairOrderService.addRepairOrder(this.repairOrderToUpdate).subscribe((data) => {
          this.saveDone = true;
          this.isUpdateMode = true;
          this.idRepairOrder = data.Id;
          this.getDataToUpdate();
        });
      } else {
        this.growlService.warningNotification(this.translateService.instant(GarageConstant.EMPTY_REPAIR_ORDER_ERROR));
      }
    }
    else {
      this.validationService.validateAllFormFields(this.addRepairOrderFormGroup);
    }
  }

  saveAndRegenerateQuotation() {
    this.IdVehicle.setValidators(undefined);
    this.IdVehicle.updateValueAndValidity();
    if (this.addRepairOrderFormGroup.valid) {
      if (this.isRepairOrderNotEmpty()) {
        this.repairOrderToUpdate = Object.assign({}, this.repairOrderToUpdate, this.addRepairOrderFormGroup.getRawValue());
        this.repairOrderToUpdate.RepairOrderOperation = this.repairOrderOperationsList;
        this.repairOrderToUpdate.RepairOrderItem = this.repairOrderItemList;
        this.repairOrderToUpdate.ListIdOperationKit = this.getInterventionOperationKit();
        this.repairOrderService.updateRepairOrderAndQuotation(this.repairOrderToUpdate).subscribe((data) => {
          this.saveDone = true;
          this.isUpdateMode = true;
          this.idRepairOrder = data.Id;
          this.getDataToUpdate();
        });
      } else {
        this.growlService.warningNotification(this.translateService.instant(GarageConstant.EMPTY_REPAIR_ORDER_ERROR));
      }
    }
    else {
      this.validationService.validateAllFormFields(this.addRepairOrderFormGroup);
    }
  }

  generateInterventionFromRepairOrder() {
    this.IdVehicle.setValidators([Validators.required]);
    this.IdVehicle.updateValueAndValidity();
    if (!this.IdVehicle.value &&
      !(this.registrationNumberChild && this.registrationNumberChild.registrationNumberFilterDataSource.length)) {
      const TITLE = GarageConstant.ADD_CUSTOMER_VEHICLE;
      const dataToSend = this.IdTiers.value;
      this.formModalDialogService.openDialog(TITLE,
        AddCustomerVehicleComponent,
        this.viewContainerRef, this.supplierValueChange.bind(this), dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    }
    if (this.addRepairOrderFormGroup.valid) {
      if (this.isRepairOrderNotEmpty()) {
        this.repairOrderToUpdate = Object.assign({}, this.repairOrderToUpdate, this.addRepairOrderFormGroup.getRawValue());
        this.repairOrderToUpdate.RepairOrderOperation = this.repairOrderOperationsList;
        this.repairOrderToUpdate.RepairOrderItem = this.repairOrderItemList;
        this.repairOrderToUpdate.ListIdOperationKit = this.getInterventionOperationKit();
        this.repairOrderService.generateInterventionFromRepairOrder(this.repairOrderToUpdate).subscribe((data) => {
          this.saveDone = true;
          this.isUpdateMode = true;
          this.getDataToUpdate();
          let url = GarageConstant.NAVIGATE_TO_INTERVENTION_ORDER_EDIT.concat(data.Id.toString());
          this.router.navigate([]).then(() => {
            window.open(url, '_blank');
          });
        });
      } else {
        this.growlService.warningNotification(this.translateService.instant(GarageConstant.EMPTY_REPAIR_ORDER_ERROR));
      }
    }
    else {
      this.validationService.validateAllFormFields(this.addRepairOrderFormGroup);
    }
  }

  getDataToUpdate() {
    this.repairOrderService.getRepairOrderByCondiction(this.idRepairOrder).subscribe((data) => {
      this.repairOrderToUpdate = data;
      this.isRepairOrderValid = this.repairOrderToUpdate.Status === this.repairOrderStatusEnumerator.Valid;
      this.idWarehouse = data.IdGarageNavigation.IdWarehouse;
      this.idSelectedGarage = data.IdGarage;
      // set operations
      if (data.RepairOrderOperation) {
        this.repairOrderOperationsList = [];
        this.operationListIdsToIgnore = [];
        data.RepairOrderOperation.forEach((x) => {
          this.repairOrderOperationsList.unshift(x);
          this.operationListIdsToIgnore.unshift(x.IdOperation);
        });
      }
      // set items
      if (data.RepairOrderItem) {
        this.repairOrderItemList = [];
        data.RepairOrderItem.forEach((x) => {
          this.repairOrderItemList.unshift(x);
        });
      }
      // set operation kit dropdown
      if (data.RepairOrderOperationKit) {
        const operationKitForMultiSelect = [];
        this.selectedOperationKit = [];
        data.RepairOrderOperationKit.forEach((x) => {
          operationKitForMultiSelect.push({ 'Id': x.IdOperationKitNavigation.Id, 'Name': x.IdOperationKitNavigation.Name });
          this.selectedOperationKit.unshift(x.IdOperationKitNavigation);
        });
        this.ListOperationKit.setValue(operationKitForMultiSelect);
      }
      // set form group
      this.addRepairOrderFormGroup.patchValue(this.repairOrderToUpdate);
      this.selectedMileage = this.repairOrderToUpdate.IdMileageProgrammedNavigation
        ? this.repairOrderToUpdate.IdMileageProgrammedNavigation.Name : '';
      // set vehicle dropdown
      if (this.registrationNumberChild) {
        this.registrationNumberChild.realoadData(this.IdTiers.value);
      }
      this.selectedType(this.repairOrderToUpdate.RepairOrderType);
      // disable form group
      if (this.isRepairOrderValid) {
        this.addRepairOrderFormGroup.disable();
        this.isOperationKitDisabled = true;
      }
      this.IdTiers.disable();
    });
  }

  showDocument() {
    let url = GarageConstant.NAVIGATE_TO_SALES_QUOTATION_URL;
    const document = this.repairOrderToUpdate.IdQuotationDocumentNavigation;
    if (document.IdDocumentStatus !== documentStatusCode.Provisional && document.IdDocumentStatus !== documentStatusCode.DRAFT) {
      url = url.concat(GarageConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    } else {
      url = url.concat('edit').concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    }
    this.router.navigate([]).then(() => {
      window.open(url, '_blank');
    });
  }

  showIntervention(idIntervention: number) {
    let url = GarageConstant.NAVIGATE_TO_INTERVENTION_ORDER_EDIT.concat(idIntervention.toString());
    this.router.navigate([]).then(() => {
      window.open(url, '_blank');
    });
  }

  supplierValueChange($event) {
    this.IdVehicle.setValue(undefined);
    if (this.registrationNumberChild) {
      this.registrationNumberChild.realoadData(this.IdTiers.value);
    }
  }

  garageSelectedChanged($event) {
    if (!this.isUpdateMode || (this.isUpdateMode && this.repairOrderToUpdate
      && this.repairOrderToUpdate.Status === this.repairOrderStatusEnumerator.Provisional)) {
      if (this.repairOrderItemList.length > 0) {
        if ($event) {
          this.handleGarageChanges($event.Id, $event.IdWarehouse);
        } else {
          // In case of removing the garage while there is already selected items
          this.growlService.ErrorNotification(this.translateService.instant(
            GarageConstant.REMOVE_WARHOUSE_IN_INTERVENTION_WARNING));
          this.IdGarage.setValue(this.idSelectedGarage);
        }
      } else {
        // If there is no selected items we can change the garage without any verification
        this.idSelectedGarage = $event.Id;
        this.idWarehouse = $event.IdWarehouse;
      }
    } else {
      // in this case the garage dropdown must be disable so if someone want to inspect and change the value
      this.IdGarage.setValue(this.idSelectedGarage);
    }
  }

  handleGarageChanges(idGarage: any, idWarehouse: any) {
    this.swalWarrings.CreateSwal(GarageConstant.CHANGING_WARHOUSE_IN_INTERVENTION_WARNING)
      .then((result: { value: any; }) => {
        if (result.value) {
          this.UpdateItemsAvailabilityAfterChangingTheWarehouse(idGarage, idWarehouse);
        } else {
          this.IdGarage.setValue(this.idSelectedGarage);
        }
      });
  }

  UpdateItemsAvailabilityAfterChangingTheWarehouse(idGarage: any, idWarehouse: any) {
    const itemsQuantities: { [id: number]: number; } = {};
    this.repairOrderItemList.forEach(x => itemsQuantities[x.IdItem] = x.Quantity);
    this.interventionService.getItemsRemaningQuantityForWarehouse(itemsQuantities, idWarehouse).subscribe((res) => {
      if (res && res.length > 0) {
        res.forEach((interventionItem) => {
          const index = this.repairOrderItemList.findIndex(y => y.IdItem === interventionItem.Id);
          this.repairOrderItemList[index].RemainingQuantity = interventionItem.RemainingQuantity;
        });
        this.idWarehouse = idWarehouse;
        this.idSelectedGarage = idGarage;
        this.IdGarage.setValue(this.idSelectedGarage);
      } else {
        this.IdGarage.setValue(this.idSelectedGarage);
      }
    });
  }

  mileageValueChanged($event) {
    const mileageValue = $event.target.value;
    this.mileageService.GetProposedMileageToDoForCurrentMileage(mileageValue)
      .subscribe(x => {
        if (x) {
          this.IdMileageProgrammed.setValue(x.Id);
          this.selectedMileage = x.Name;
          this.showProposedOperationGrid = this.showMileageProgrammedDropdown && (this.IdMileageProgrammed.value > 0);
        } else {
          this.showProposedOperationGrid = false;
        }
      });
  }

  selectedType($event) {
    if ($event === this.interventionTypeEnumerator.PlannedIntervention) {
      this.showMileageProgrammedDropdown = true;
      this.showOperationKitDropdown = false;
      this.ListOperationKit.setValue(undefined);
      this.selectedOperationKit = [];
    } else if ($event === this.interventionTypeEnumerator.UnPlannedIntervention) {
      this.showOperationKitDropdown = true;
      this.showMileageProgrammedDropdown = false;
      this.IdMileageProgrammed.setValue(undefined);
    } else {
      this.showMileageProgrammedDropdown = false;
      this.showOperationKitDropdown = false;
      this.ListOperationKit.setValue(undefined);
      this.selectedOperationKit = [];
      this.IdMileageProgrammed.setValue(undefined);
    }
    this.showProposedOperationGrid = this.showMileageProgrammedDropdown && (this.IdMileageProgrammed.value > 0);
  }

  mileageProposedValueChange($event) {
    this.selectedMileage = $event ? $event.Name : '';
    this.showProposedOperationGrid = this.showMileageProgrammedDropdown && (this.IdMileageProgrammed.value > 0);
  }

  selectedOneOpeartionKitFromCheckbox($event) {
    // Add operation kit only if the garage is selected
    if (this.IdGarage.value) {
      this.selectedOperationKit.push($event);
      this.updateListOperationAndItemsFromOperationKit();
    } else {
      // In case of removing the warehouse while there is already selected items
      this.growlService.ErrorNotification(this.translateService.instant(
        GarageConstant.WAREHOUSE_MUST_BE_SELECTED_IN_INTERVENTION));
      this.ListOperationKit.setValue([]);
    }
  }

  deSelectedOneOpeartionKitFromCheckbox($event) {
    this.selectedOperationKit = this.selectedOperationKit.filter(s => s.Id !== $event.Id);
    this.updateListOperationAndItemsFromOperationKit();
  }

  updateListOperationAndItemsFromOperationKit() {
    if (this.ListOperationKit.value) {
      const selectedOperationKitIds = this.ListOperationKit.value.map((x: { Id: any; }) => x.Id);
      this.operationKitService.getOperationAndItemForOperationKit(selectedOperationKitIds, this.idWarehouse).subscribe((data) => {
        this.listOperationFromOperationKit = data.Operations;
        this.listItemFromOperationKit = data.Items;
        // Add operations to the RepairOrderOperation list
        this.listOperationFromOperationKit.forEach((x) => {
          const repairOrderOperation = this.createRepairOrderOperationFromOperation(x);
          const index = this.repairOrderOperationsList.findIndex(y => y.IdOperation === repairOrderOperation.IdOperation);
          if (index < 0) {
            this.repairOrderOperationsList.unshift(repairOrderOperation);
            this.operationListIdsToIgnore.unshift(repairOrderOperation.IdOperation);
            this.repairOrderOperationsList = this.repairOrderOperationsList.slice();
          }
        });
        // Add items to the RepairOrderItems list
        this.listItemFromOperationKit.forEach((x) => {
          const repairOrderItem = this.createRepairOrderItemFromItem(x);
          const index = this.repairOrderItemList.findIndex(y => y.IdItem === repairOrderItem.IdItem);
          if (index < 0) {
            this.repairOrderItemList.unshift(repairOrderItem);
            this.repairOrderItemList = this.repairOrderItemList.slice();
          }
        });
      });
    }
  }

  private createRepairOrderOperationFromOperation(dataItem): RepairOrderOperation {
    const repairOrderOperation = new Object() as RepairOrderOperation;
    repairOrderOperation.Id = 0;
    repairOrderOperation.IdRepairOrder = this.idRepairOrder;
    repairOrderOperation.IdOperation = dataItem.Id;
    repairOrderOperation.Htprice = dataItem.Htprice;
    repairOrderOperation.IdOperationNavigation = dataItem;
    repairOrderOperation.Duration = dataItem.ExpectedDuration;
    return repairOrderOperation;
  }

  private createRepairOrderItemFromItem(dataItem): RepairOrderItem {
    const repairOrderItem = new Object() as RepairOrderItem;
    repairOrderItem.IdItemNavigation = new Item();
    repairOrderItem.IdItemNavigation.Description = dataItem.Description;
    repairOrderItem.IdItemNavigation.Code = dataItem.Code;
    repairOrderItem.Id = 0;
    repairOrderItem.IdItem = dataItem.Id;
    repairOrderItem.IdRepairOrder = this.idRepairOrder;
    repairOrderItem.UnitHtsalePrice = dataItem.UnitHtsalePrice;
    repairOrderItem.Quantity = dataItem.OrderedQuantity;
    repairOrderItem.Htprice = dataItem.Htprice;
    repairOrderItem.RemainingQuantity = dataItem.RemainingQuantity;
    return repairOrderItem;
  }

  operationKitMultiSelectAllValueChange($event) {
    if (this.IdGarage.value) {
      this.selectedOperationKit = $event;
      const listOperationKitValue = $event.map((value) => { return { 'Id': value.Id, 'Name': value.Name } });
      this.ListOperationKit.setValue(listOperationKitValue);
      this.updateListOperationAndItemsFromOperationKit();
    } else {
      this.growlService.ErrorNotification(this.translateService.instant(
        GarageConstant.WAREHOUSE_MUST_BE_SELECTED_IN_INTERVENTION));
      this.ListOperationKit.setValue([]);
    }
  }

  operationAddedFromProposition($event) {
    if (this.operationToBePerformedChild) {
      this.operationToBePerformedChild.processGridData();
    }
    this.operationListIdsToIgnore.unshift($event);
  }

  onSparePartsChanged($event) {
    this.operationsChanged.emit($event);
  }

  showOperationsProposed() {
    const title = GarageConstant.PROPOSED_OPERATIONS;
    const data = this.IdMileageProgrammed.value;
    this.formModalDialogService.openDialog(title, OperationsProposedPopUpComponent,
      this.viewContainerRef, null, data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  showOperationKitSelected() {
    const title = GarageConstant.OPERATION_KIT_SELECTED;
    const data = this.selectedOperationKit;
    this.formModalDialogService.openDialog(title, OperationKitSelectedComponent,
      this.viewContainerRef, null, data, true, SharedConstant.MODAL_DIALOG_SIZE_ML);

  }

  showProposedOperationContentChange(action: boolean) {
    if (action) {
      this.showProposedOperationContent = true;
      this.setBorderStyleForProposedOperation = this.fieldsetBorderShowed;
    } else {
      this.showProposedOperationContent = false;
      this.setBorderStyleForProposedOperation = this.fieldsetBorderHidden;
    }
  }

  showOperationToBePerformedContentChange(action: boolean) {
    if (action) {
      this.showOperationToBePerformedContent = true;
      this.setBorderStyleForOperationToBePerformed = this.fieldsetBorderShowed;
    } else {
      this.showOperationToBePerformedContent = false;
      this.setBorderStyleForOperationToBePerformed = this.fieldsetBorderHidden;
    }
  }

  showSparePartsContentChange(action: boolean) {
    if (action) {
      this.showSparePartsContent = true;
      this.setBorderStyleForSpareParts = this.fieldsetBorderShowed;
    } else {
      this.showSparePartsContent = false;
      this.setBorderStyleForSpareParts = this.fieldsetBorderHidden;
    }
  }

  onButtonItemClick($event) {
    if ($event && $event.type === 'PRINT') {
      this.printReport();
    } else if ($event && $event.type === 'MAIL') {
      this.sendQuotationToCustomer();
    }
  }

  sendQuotationToCustomer() {
    this.swalWarrings.CreateSwal(GarageConstant.CONFIRM_QUOTATION_EMAIL_SEND,
      GarageConstant.QUOTATION_EMAIL_TITLE).then(async (result) => {
        if (result.value) {
          // update repaiur or
          this.updateRepairOrderBeforeCallBack().then(
            () => {
              // After update send email to customer
              this.repairOrderService.sendQuotationInMail(this.repairOrderToUpdate, this.companyCurrency, this.IdTiers.value, this.language).subscribe((data) => {
                  this.repairOrderToUpdate.IdEmail = data.Id;
              });
            }
          );
        }
      });
  }

  printReport() {
    this.swalWarrings.CreateSwal(GarageConstant.PRINT_QUOTATION_REPORT_MESSAGE,
      GarageConstant.PRINT_QUOTATION_REPORT_TITLE).then(async (result) => {
        if (result.value) {
          this.updateRepairOrderBeforeCallBack().then(
            () => {
              // after updating do the print
             this.printQuotationReport();
            });
        }
      });
  }

  printQuotationReport() {
    const documentName = this.translateService.instant(GarageConstant.REPAIR_ORDER_QUOTATION);
    const params = {
      'idRepairOrder': this.idRepairOrder,
    };
    const dataToSend = {
      'reportName': 'RepairOrderQuotation',
      'documentName': documentName.concat('_').concat(this.repairOrderToUpdate.Code),
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'PrintType': '-1',
      'reportparameters': params
    };
    this.interventionService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      }
    );
  }

  updateRepairOrderBeforeCallBack(): Promise<any> {
    this.IdVehicle.setValidators(undefined);
    this.IdVehicle.updateValueAndValidity();
    if (this.addRepairOrderFormGroup.disabled || this.addRepairOrderFormGroup.valid) {
      if (this.isRepairOrderNotEmpty()) {
        this.repairOrderToUpdate = Object.assign({}, this.repairOrderToUpdate, this.addRepairOrderFormGroup.getRawValue());
        this.repairOrderToUpdate.RepairOrderOperation = this.repairOrderOperationsList;
        this.repairOrderToUpdate.RepairOrderItem = this.repairOrderItemList;
        this.repairOrderToUpdate.ListIdOperationKit = this.getInterventionOperationKit();
        return new Promise(resolve => {
          this.repairOrderService.UpdateRepairOrder(this.repairOrderToUpdate).subscribe((data) => {
            this.saveDone = true;
            this.isUpdateMode = true;
            this.idRepairOrder = data.Id;
            this.getDataToUpdate();
            resolve(true);
          });
        });
      } else {
        this.growlService.warningNotification(this.translateService.instant(GarageConstant.EMPTY_REPAIR_ORDER_ERROR));
      }
    }
    else {
      this.validationService.validateAllFormFields(this.addRepairOrderFormGroup);
    }
  }

  isRepairOrderNotEmpty(): boolean {
    return (this.repairOrderItemList.length > 0) || (this.repairOrderOperationsList.length > 0)
  }

  goBackToList() {
    this.router.navigateByUrl(GarageConstant.NAVIGATE_TO_REPAIR_ORDER_LIST);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.addRepairOrderFormGroup.dirty);
  }

  getInterventionOperationKit(): any[] {
    const listOperationKit = this.ListOperationKit.value;
    return listOperationKit ? listOperationKit.map((x: { Id: any; }) => x.Id) : [];
  }

  get IdTiers(): FormControl {
    return this.addRepairOrderFormGroup.get(GarageConstant.ID_TIERS) as FormControl;
  }

  get IdVehicle(): FormControl {
    return this.addRepairOrderFormGroup.get(GarageConstant.ID_VEHICLE) as FormControl;
  }

  get IdGarage(): FormControl {
    return this.addRepairOrderFormGroup.get(GarageConstant.ID_GARAGE) as FormControl;
  }

  get CurrentMileage(): FormControl {
    return this.addRepairOrderFormGroup.get(GarageConstant.CURRENT_MILEAGE) as FormControl;
  }

  get RepairOrderType(): FormControl {
    return this.addRepairOrderFormGroup.get(GarageConstant.REPAIR_ORDER_TYPE) as FormControl;
  }

  get InterventionFor(): FormControl {
    return this.addRepairOrderFormGroup.get(GarageConstant.INTERVENTION_FOR) as FormControl;
  }

  get IdMileageProgrammed(): FormControl {
    return this.addRepairOrderFormGroup.get(GarageConstant.ID_MILEAGE_PROGRAMMED) as FormControl;
  }

  get ListOperationKit(): FormControl {
    return this.addRepairOrderFormGroup.get(GarageConstant.LIST_OPERATION_KIT) as FormControl;
  }
}
