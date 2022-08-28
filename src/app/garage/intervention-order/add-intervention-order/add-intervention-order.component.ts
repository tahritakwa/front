import { Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { InterventionOrderStateEnumerator } from '../../../models/enumerators/intervention-order-state.enum';
import { OperationStatusEnumerator } from '../../../models/enumerators/operation-status.enum';
import { OperationValidateByEnumerator } from '../../../models/enumerators/operation-validate-by.enum';
import { InterventionItem } from '../../../models/garage/intervention-item.model';
import { InterventionOperation } from '../../../models/garage/intervention-operation.model';
import { Intervention } from '../../../models/garage/intervention.model';
import { OperationKit } from '../../../models/garage/operation-kit.model';
import { Vehicle } from '../../../models/garage/vehicle.model';
import { Item } from '../../../models/inventory/item.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FileService } from '../../../shared/services/file/file-service.service';
import { dateValueGT, dateValueLT, strictSup, ValidationService } from '../../../shared/services/validation/validation.service';
import { AddInterventionOperationsComponent } from '../../components/add-intervention-operations/add-intervention-operations.component';
import {
  ReceptionForOrderInterventionComponent
} from '../../components/reception-for-order-intervention/reception-for-order-intervention.component';
import { VehicleInformationComponent } from '../../components/vehicle-information/vehicle-information.component';
import { InterventionService } from '../../services/intervention/intervention.service';
import { OperationKitService } from '../../services/operation-kit/operation-kit.service';
import { OperationForInterventionOrderComponent } from '../operation-for-intervention-order/operation-for-intervention-order.component';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { SendReminderSmsComponent } from '../../components/reminder-sms/send-reminder-sms/send-remider-sms.component';

@Component({
  selector: 'app-add-intervention-order',
  templateUrl: './add-intervention-order.component.html',
  styleUrls: ['./add-intervention-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddInterventionOrderComponent implements OnInit {

  @ViewChild('vehicleInfoViewChild') vehicleInfoViewChild: VehicleInformationComponent;
  @ViewChild('operationViewChild') operationViewChild: OperationForInterventionOrderComponent;
  @ViewChild('receptionForOrderInterventionViewChild') receptionForOrderInterventionViewChild: ReceptionForOrderInterventionComponent;
  public interventionOperationsList = [];
  public interventionItemList = [];
  public customerPartsList = [];
  public operationListIdsToIgnore = [];
  public selectedOperationKit: Array<OperationKit> = [];
  public listOperationFromOperationKit = [];
  public listItemFromOperationKit = [];
  idVehicle: number;
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  addInterventionFormGroup: FormGroup;
  addReceptionFormGroup: FormGroup;
  selectedVehicle: Vehicle;
  selectedMileage: string;
  isProposedOperationGridVisible: string;
  interventionOrderToValidate: Intervention;
  isOperationKitDisabled = false;
  // Update attributes
  id: number;
  isUpdateMode = false;
  private saveDone = false;
  isInterventionCompleted = false;
  interventionOrderToUpdate: any;
  // Enums
  interventionStateEnumerator = InterventionOrderStateEnumerator;
  operationStatusEnumerator = OperationStatusEnumerator;
  operationValidateByEnumerator = OperationValidateByEnumerator;
  // files
  diagnosticVehicleImg: FileInfo;
  idWarehouse: number;
  idSelectedGarage: number;
  isChanged = false;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasPrintCustomerReportPermission: boolean;
  public hasPrintWorkShopChiefReportPermission: boolean;
  public reportsAllTypes = [];
  constructor(private fb: FormBuilder, private validationService: ValidationService, private router: Router,
    private formModalDialogService: FormModalDialogService, public viewRef: ViewContainerRef,
    public activatedRoute: ActivatedRoute, private interventionService: InterventionService,
    private operationKitService: OperationKitService, public growlService: GrowlService, private authService: AuthService,
    public translate: TranslateService, private fileService: FileService, private swalWarrings: SwalWarring) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[GarageConstant.ID] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.ADD_INTERVENTION);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.UPDATE_INTERVENTION);
    this.hasPrintCustomerReportPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.PRINT_CUSTOMER_REPORT);
    this.hasPrintWorkShopChiefReportPermission =
      this.authService.hasAuthority(PermissionConstant.GaragePermissions.PRINT_WORKSHOP_CHIEF_REPORT);
    if (this.hasPrintCustomerReportPermission) {
      this.reportsAllTypes.push({ printType: 'CLIENT_REPORT', TemplateCode: this.translate.instant('CLIENT_REPORT') });
    }
    if (this.hasPrintWorkShopChiefReportPermission) {
      this.reportsAllTypes.push({ printType: 'WORKSHOP_CHIEF_REPORT', TemplateCode: this.translate.instant('WORKSHOP_CHIEF_REPORT') });
    }
    this.createAddReceptionFormGroup();
    this.createAddInterventionFormGroup();
    this.subscribeToFormChanged();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  createAddInterventionFormGroup() {
    this.addInterventionFormGroup = this.fb.group({
      Id: [0],
      IdGarage: [undefined, Validators.required],
      InterventionType: [undefined],
      InterventionFor: [undefined],
      IdMileageProgrammed: [undefined],
      InterventionDate: [undefined],
      InterventionHours: [undefined],
      ExpectedDeliveryDate: [undefined],
      ExpectedDeliveryHours: [undefined],
      IdReceptionNavigation: this.addReceptionFormGroup
    });
    this.addDependencyControl();
  }


  createAddReceptionFormGroup() {
    this.addReceptionFormGroup = this.fb.group({
      Id: 0,
      IdVehicle: [undefined, Validators.required],
      IdWorker: [undefined],
      ReceiptDate: [undefined, Validators.required],
      ReceiptHours: [undefined, Validators.required],
      CurrentMileage: [undefined],
      FuelLevel: [undefined],
      Note: [undefined],
      LoanVehicle: [NumberConstant.ZERO],
      CigaretteLigher: [NumberConstant.ZERO],
      CrickTools: [NumberConstant.ZERO],
      SpareWheel: [NumberConstant.ZERO],
      Radio: [NumberConstant.ZERO],
      HandTools: [NumberConstant.ZERO],
      HubCap: [NumberConstant.ZERO],
      ListOperationKit: [undefined]
    });
    this.addReceptionFormGroup.controls.CurrentMileage.setValidators(
      this.validationService.conditionalValidator((() => this.addReceptionFormGroup.controls.CurrentMileage.value),
        strictSup(0)));
    this.addReceptionFormGroup.controls.CurrentMileage.updateValueAndValidity();
  }

  addDependencyControl() {
    // ReceiptDate validator
    this.ReceiptDate.setValidators([Validators.required, this.validationService.conditionalValidator((() => this.InterventionDate.value),
      dateValueLT(new Observable(o => o.next(this.InterventionDate.value))))]);
    // InterventionDate validator
    this.InterventionDate.setValidators([this.validationService.conditionalValidator((() => this.InterventionHours.value
      || this.interventionOrderToUpdate && this.interventionOrderToUpdate.Status >= this.interventionStateEnumerator.InProgress),
      Validators.required), this.validationService.conditionalValidator((() => this.InterventionDate.value),
        dateValueGT(new Observable(o => o.next(this.ReceiptDate.value)))),
    this.validationService.conditionalValidator((() => this.ExpectedDeliveryDate.value),
      dateValueLT(new Observable(o => o.next(this.ExpectedDeliveryDate.value))))]);
    // ExpectedDeliveryDate validator
    this.ExpectedDeliveryDate.setValidators([this.validationService.conditionalValidator((() => this.ExpectedDeliveryHours.value),
      Validators.required), this.validationService.conditionalValidator((() => this.InterventionDate.value),
        dateValueGT(new Observable(o => o.next(this.InterventionDate.value))))]);

    this.ReceiptDate.updateValueAndValidity();
    this.InterventionDate.updateValueAndValidity();
    this.ExpectedDeliveryDate.updateValueAndValidity();
  }

  save() {
    this.addDependencyControl();
    if (this.addInterventionFormGroup.valid) {
      // Set intervention data
      this.prepareIntervention();
      // Save the intervention and his reception
      if (!this.isUpdateMode) {
        this.interventionService.addIntervention(this.interventionOrderToUpdate).subscribe((data) => {
          this.saveDone = true;
          this.id = data.Id;
          this.isUpdateMode = true;
          this.getDataToUpdate();
        });
      } else {
        this.interventionService.updateIntervention(this.interventionOrderToUpdate).subscribe(() => {
          this.saveDone = true;
          this.getDataToUpdate();
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.addInterventionFormGroup);
    }
  }

  updateInterventionItem() {
    this.prepareIntervention();
    return new Promise(resolve => {
      this.interventionService.updateIntervention(this.interventionOrderToUpdate).subscribe(() => {
        this.saveDone = true;
        resolve(true);
      });
    });
  }

  prepareIntervention() {
    const idReceptionNavigation = Object.assign({}, this.interventionOrderToUpdate ? this.interventionOrderToUpdate.IdReceptionNavigation : {}, this.addReceptionFormGroup.getRawValue());
    this.interventionOrderToUpdate = Object.assign({}, this.interventionOrderToUpdate, this.addInterventionFormGroup.getRawValue());
    this.interventionOrderToUpdate.IdReceptionNavigation = idReceptionNavigation;
    this.interventionOrderToUpdate.IdReceptionNavigation.IdReceiverWorker = this.IdWorker.value;
    this.interventionOrderToUpdate.IdReceptionNavigation.VehicleDiagnosticPictureFileInfo = this.diagnosticVehicleImg;
    this.interventionOrderToUpdate.IdReceptionNavigation.IdVehicleNavigation = this.selectedVehicle;
    this.setHoursBeforeSave();
    this.interventionOrderToUpdate.InterventionOperation = this.operationViewChild.getInterventionOperation();
    this.interventionOrderToUpdate.InterventionItem = this.operationViewChild.getInterventionItem();
    this.interventionOrderToUpdate.ListIdOperationKit = this.receptionForOrderInterventionViewChild.getInterventionOperationKit();
    this.interventionOrderToUpdate.CustomerParts = this.operationViewChild.getCustomerParts();
    if (this.receptionForOrderInterventionViewChild.getLoanVehicleValue()) {
      // if the result of getLoanVehicleValue not null add the relation
      this.interventionOrderToUpdate.InterventionLoanVehicle = [this.receptionForOrderInterventionViewChild.getLoanVehicleValue()];
    }
  }


  startIntervention() {
    this.InterventionDate.setValidators([Validators.required, this.InterventionDate.validator]);
    this.InterventionDate.updateValueAndValidity();
    if (!this.InterventionDate.value) {
      this.growlService.ErrorNotification(this.translate.instant(GarageConstant.INTERVENTION_LANCH_EXCEPTION));
    }
    if (this.addInterventionFormGroup.valid) {
      this.swalWarrings.CreateSwal(GarageConstant.LAUNCH_MESSAGE).then((result: { value: any; }) => {
        if (result.value) {
          this.prepareIntervention();
          this.interventionService.startIntervention(this.interventionOrderToUpdate).subscribe(res => {
            this.saveDone = true;
            this.id = res.Id;
            this.getDataToUpdate();
          });
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.addInterventionFormGroup);
    }
  }

  finishIntervention() {
    this.ExpectedDeliveryDate.setValidators([Validators.required, this.ExpectedDeliveryDate.validator]);
    this.ExpectedDeliveryDate.updateValueAndValidity();
    if (!this.ExpectedDeliveryDate.value) {
      this.growlService.ErrorNotification(this.translate.instant(GarageConstant.INTERVENTION_CLOSE_EXCEPTION));
    }
    if (this.addInterventionFormGroup.valid) {
      const hasOperationNotCompleted = this.interventionOperationsList.find(x => x.Status === OperationStatusEnumerator.New ||
        x.Status === OperationStatusEnumerator.InProgress) !== undefined ? true : false;
      this.swalWarrings.CreateSwal(hasOperationNotCompleted ?
        GarageConstant.COMPLETE_OPERATIONS : GarageConstant.FINISH_MESSAGE).then((result: { value: any; }) => {
          if (result.value) {
            this.prepareIntervention();
            if (hasOperationNotCompleted) {
              this.changeOperationsNotCompletedState();
            }
            this.interventionService.finishIntervention(this.interventionOrderToUpdate).subscribe(res => {
              this.saveDone = true;
              this.getDataToUpdate();
            });
          }
        });
    } else {
      this.validationService.validateAllFormFields(this.addInterventionFormGroup);
    }
  }
  // if there are operations in progress or new
  changeOperationsNotCompletedState() {
    this.interventionOrderToUpdate.InterventionOperation.forEach(operation => {
      if (operation.Status === OperationStatusEnumerator.InProgress ||
        operation.Status === OperationStatusEnumerator.New) {
        operation.Status = OperationStatusEnumerator.Completed;
      }
    });
  }

  public onPrintReportClick($event): void {
    if (this.isChanged) {
      this.swalWarrings.CreateSwal(GarageConstant.INTERVENTION_CHANGED_MESSAGE,
        GarageConstant.INTERVENTION_CHANGED_TITLE).then(async (result) => {
          if (result.value) {
            // update intervention
            this.updateInterventionItem().then(
              () => {
                this.isChanged = false;
                // after updating do the print
                this.printReport($event);
              }
            );
          }
        });
    } else {
      // do the print
      this.printReport($event);
    }
  }

  printReport($event) {
    let ReportName = '';
    if ($event && $event.printType === 'CLIENT_REPORT' && this.hasPrintCustomerReportPermission) {
      ReportName = GarageConstant.INTERVENTION_RECEPTION_REPORT;
    }
    if ($event && $event.printType === 'WORKSHOP_CHIEF_REPORT' && this.hasPrintWorkShopChiefReportPermission) {
      ReportName = GarageConstant.INTERVENTION_OPERATIONS_REPORT;
    }
    const params = {
      'idIntervention': this.id,
    };
    const dataToSend = {
      'reportName': ReportName,
      'documentName': ReportName.concat('_').concat(this.interventionOrderToUpdate.Code),
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

  subscribeToFormChanged() {
    this.addInterventionFormGroup.valueChanges.subscribe(() => {
      this.isChanged = true;
    });
    this.addReceptionFormGroup.valueChanges.subscribe(() => {
      this.isChanged = true;
    });
  }

  showDocument() {
    let url = '';
    if (this.interventionOrderToUpdate.Status === this.interventionStateEnumerator.InProgress) {
      url = GarageConstant.NAVIGATE_TO_SALES_DELIVERY_URL;
      const document = this.interventionOrderToUpdate.IdDeliveryDocumentNavigation;
      if (document.IdDocumentStatus !== documentStatusCode.Provisional && document.IdDocumentStatus !== documentStatusCode.DRAFT) {
        url = url.concat(GarageConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
      } else {
        url = url.concat('edit').concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
      }
    } else if (this.interventionOrderToUpdate.Status === this.interventionStateEnumerator.Completed) {
      url = GarageConstant.NAVIGATE_TO_SALES_INVOICE_URL;
      const document = this.interventionOrderToUpdate.IdInvoiceDocumentNavigation;
      if (document.IdDocumentStatus !== documentStatusCode.Provisional && document.IdDocumentStatus !== documentStatusCode.DRAFT) {
        url = url.concat(GarageConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
      } else {
        url = url.concat('edit').concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
      }
    }
    this.router.navigate([]).then(() => {
      window.open(url, '_blank');
    });
  }

  setHoursBeforeSave() {
    // ReceiptHours
    const receiptHours: Date = new Date(this.ReceiptHours.value);
    this.interventionOrderToUpdate.IdReceptionNavigation.ReceiptHours =
      String(receiptHours.getHours()).concat(':').concat(String(receiptHours.getMinutes()));
    // Intevention hours
    if (this.InterventionHours.value) {
      const interventionHours: Date = new Date(this.InterventionHours.value);
      this.interventionOrderToUpdate.InterventionHours =
        String(interventionHours.getHours()).concat(':').concat(String(interventionHours.getMinutes()));
    } else {
      this.interventionOrderToUpdate.InterventionHours = null;
    }
    // expecteDelivery hours
    if (this.ExpectedDeliveryHours.value) {
      const expectedDeliveryHours: Date = new Date(this.ExpectedDeliveryHours.value);
      this.interventionOrderToUpdate.ExpectedDeliveryHours =
        String(expectedDeliveryHours.getHours()).concat(':').concat(String(expectedDeliveryHours.getMinutes()));
    } else {
      this.interventionOrderToUpdate.ExpectedDeliveryHours = null;
    }
  }

  getDataToUpdate() {
    this.interventionService.getInterventionByCondiction(this.id).subscribe((data) => {
      this.interventionOrderToUpdate = data;
      this.isInterventionCompleted = this.interventionOrderToUpdate.Status === this.interventionStateEnumerator.Completed;
      this.idWarehouse = data.IdGarageNavigation.IdWarehouse;
      this.idSelectedGarage = data.IdGarage;
      if (data.InterventionOperation) {
        this.interventionOperationsList = [];
        this.operationListIdsToIgnore = [];
        data.InterventionOperation.forEach((x) => {
          this.interventionOperationsList.unshift(new InterventionOperation(x));
          this.operationListIdsToIgnore.unshift(x.IdOperation);
        });
      }
      if (data.InterventionItem) {
        this.interventionItemList = [];
        data.InterventionItem.forEach((x) => {
          this.interventionItemList.unshift(x);
        });
      }
      if (data.InterventionOperationKit) {
        const operationKitForMultiSelect = [];
        this.selectedOperationKit = [];
        data.InterventionOperationKit.forEach((x) => {
          operationKitForMultiSelect.push({ 'Id': x.IdOperationKitNavigation.Id, 'Name': x.IdOperationKitNavigation.Name });
          this.selectedOperationKit.unshift(x.IdOperationKitNavigation);
        });
        this.addReceptionFormGroup.controls.ListOperationKit.setValue(operationKitForMultiSelect);
      }
      if (data.CustomerParts) {
        this.customerPartsList = [];
        data.CustomerParts.forEach((x) => {
          this.customerPartsList.unshift(x);
        });
      }
      if (data && data.InterventionLoanVehicle.length > 0) {
        // Set it true for the first time
        this.addReceptionFormGroup.controls.LoanVehicle.setValue(true);
      }
      this.setFormGroup();
      if (!this.hasUpdatePermission) {
        this.addInterventionFormGroup.disable();
        this.addReceptionFormGroup.disable();
      }
    });
  }

  /**
   * Set intervention formGroup value
   */
  setFormGroup() {
    // Set date and hours
    this.setDateAndHoursInGetDataToUpdate();
    // Set value of the formGroup
    this.addInterventionFormGroup.patchValue(this.interventionOrderToUpdate);
    this.IdWorker.setValue(this.interventionOrderToUpdate.IdReceptionNavigation.IdReceiverWorker);
    // Set value of the selectedVehicle
    this.selectedVehicle = this.interventionOrderToUpdate.IdReceptionNavigation.IdVehicleNavigation;
    if (this.vehicleInfoViewChild) {
      this.vehicleInfoViewChild.setVehichle(this.selectedVehicle);
    }
    if (this.receptionForOrderInterventionViewChild) {
      this.diagnosticVehicleImg = this.interventionOrderToUpdate.IdReceptionNavigation.VehicleDiagnosticPictureFileInfo;
      this.receptionForOrderInterventionViewChild.setvehicleDiagnosticImage(this.diagnosticVehicleImg);
      this.receptionForOrderInterventionViewChild.selectedType(this.interventionOrderToUpdate.InterventionType);
    }
    if (this.interventionOrderToUpdate && this.interventionOrderToUpdate.Status !== this.interventionStateEnumerator.Open) {
      this.IdVehicle.disable();
      this.IdGarage.disable();
      this.idVehicle = this.IdVehicle.value;
    }
    this.selectedMileage = this.interventionOrderToUpdate.IdMileageProgrammedNavigation
      ? this.interventionOrderToUpdate.IdMileageProgrammedNavigation.Name : '';
    if (this.interventionOrderToUpdate && this.interventionOrderToUpdate.Status === this.interventionStateEnumerator.Completed) {
      this.addInterventionFormGroup.disable();
      this.isOperationKitDisabled = true;
    }
  }


  addOperation() {
    const title = GarageConstant.CAR_BREAK_DOWN;
    this.formModalDialogService.openDialog(title, AddInterventionOperationsComponent,
      this.viewRef, null, null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  setDateAndHoursInGetDataToUpdate() {
    // Set receipt date
    this.interventionOrderToUpdate.IdReceptionNavigation.ReceiptDate =
      new Date(this.interventionOrderToUpdate.IdReceptionNavigation.ReceiptDate);
    // Set receipt hours
    const receiptHourValue = this.interventionOrderToUpdate.IdReceptionNavigation.ReceiptHours.Hours;
    const receiptMinuteValue = this.interventionOrderToUpdate.IdReceptionNavigation.ReceiptHours.Minutes;
    const receiptHoursInDateFormat = new Date(this.interventionOrderToUpdate.IdReceptionNavigation.ReceiptDate.getFullYear(),
      this.interventionOrderToUpdate.IdReceptionNavigation.ReceiptDate.getMonth(),
      this.interventionOrderToUpdate.IdReceptionNavigation.ReceiptDate.getDate(),
      receiptHourValue,
      receiptMinuteValue
    );
    this.interventionOrderToUpdate.IdReceptionNavigation.ReceiptHours = receiptHoursInDateFormat;
    // Set intervention date
    if (this.interventionOrderToUpdate.InterventionDate) {
      this.interventionOrderToUpdate.InterventionDate =
        new Date(this.interventionOrderToUpdate.InterventionDate);
      // Set intervention hours
      if (this.interventionOrderToUpdate.InterventionHours) {
        const interventionHourValue = this.interventionOrderToUpdate.InterventionHours.Hours;
        const interventionMinuteValue = this.interventionOrderToUpdate.InterventionHours.Minutes;
        const interventionHoursInDateFormat = new Date(this.interventionOrderToUpdate.InterventionDate.getFullYear(),
          this.interventionOrderToUpdate.InterventionDate.getMonth(),
          this.interventionOrderToUpdate.InterventionDate.getDate(),
          interventionHourValue,
          interventionMinuteValue
        );
        this.interventionOrderToUpdate.InterventionHours = interventionHoursInDateFormat;
      }
    }
    // Set expected delivery date
    if (this.interventionOrderToUpdate.ExpectedDeliveryDate) {
      this.interventionOrderToUpdate.ExpectedDeliveryDate =
        new Date(this.interventionOrderToUpdate.ExpectedDeliveryDate);
      // Set expected delivery hours
      if (this.interventionOrderToUpdate.ExpectedDeliveryHours) {
        const expectedDeliveryHourValue = this.interventionOrderToUpdate.ExpectedDeliveryHours.Hours;
        const expectedDeliveryMinuteValue = this.interventionOrderToUpdate.ExpectedDeliveryHours.Minutes;
        const expectedDeliveryHoursInDateFormat = new Date(this.interventionOrderToUpdate.ExpectedDeliveryDate.getFullYear(),
          this.interventionOrderToUpdate.ExpectedDeliveryDate.getMonth(),
          this.interventionOrderToUpdate.ExpectedDeliveryDate.getDate(),
          expectedDeliveryHourValue,
          expectedDeliveryMinuteValue
        );
        this.interventionOrderToUpdate.ExpectedDeliveryHours = expectedDeliveryHoursInDateFormat;
      }
    }
  }

  /**
   * Receive selected vehicle from vehicle info component
   * @param $event
   */
  selectedVehicleChange($event) {
    this.selectedVehicle = $event;
    if (this.isUpdateMode && this.interventionOrderToUpdate
      && (this.interventionOrderToUpdate.Status !== this.interventionStateEnumerator.Open)) {
      this.IdVehicle.disable();
      this.IdVehicle.setValue(this.idVehicle);
    }
  }

  /**
   * Receive vehicle diagnostic url from reception-for-order component
   * @param $event
   */
  vehicleDiagnosticImgSrcEmit($event) {
    this.diagnosticVehicleImg = $event;
  }

  mileageProposedValueChange($event) {
    this.selectedMileage = $event;
  }

  proposedOperationGridVisible($event) {
    this.isProposedOperationGridVisible = $event;
  }

  receptionChangedValue($event) {
    this.isChanged = $event;
  }

  garageSelectedChange($event) {
    if (!this.isUpdateMode || (this.isUpdateMode && this.interventionOrderToUpdate
      && this.interventionOrderToUpdate.Status === this.interventionStateEnumerator.Open)) {
      if (this.interventionItemList.length > 0) {
        if ($event) {
          return new Promise(() => {
            setTimeout(() => {
              this.handleGarageChanges($event.Id, $event.IdWarehouse);
            }, 200);
          });
        } else {
          // In case of removing the garage while there is already selected items
          this.growlService.ErrorNotification(this.translate.instant(
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
    this.interventionItemList.forEach(x => itemsQuantities[x.IdItem] = x.Quantity);
    this.interventionService.getItemsRemaningQuantityForWarehouse(itemsQuantities, idWarehouse).subscribe((res) => {
      if (res && res.length > 0) {
        res.forEach((interventionItem) => {
          const index = this.interventionItemList.findIndex(y => y.IdItem === interventionItem.Id);
          this.interventionItemList[index].RemainingQuantity = interventionItem.RemainingQuantity;
        });
        this.idWarehouse = idWarehouse;
        this.idSelectedGarage = idGarage;
      } else {
        this.IdGarage.setValue(this.idSelectedGarage);
      }
    });
  }

  operationKitSelectedChange($event) {
    if (this.addReceptionFormGroup.controls.ListOperationKit.value) {
      const selectedOperationKitIds = this.addReceptionFormGroup.controls.ListOperationKit.value.map(x => x.Id);
      this.operationKitService.getOperationAndItemForOperationKit(selectedOperationKitIds, this.idWarehouse).subscribe((data) => {
        this.listOperationFromOperationKit = data.Operations;
        this.listItemFromOperationKit = data.Items;
        // Add operations to the InterventionOperation list
        this.listOperationFromOperationKit.forEach((x) => {
          const interventionOperation = this.createInterventionOperationFromOperation(x);
          const index = this.interventionOperationsList.findIndex(y => y.IdOperation === interventionOperation.IdOperation);
          if (index < 0) {
            this.interventionOperationsList.unshift(interventionOperation);
            this.operationListIdsToIgnore.unshift(interventionOperation.IdOperation);
            this.interventionOperationsList = this.interventionOperationsList.slice();
          }
        });
        if (!this.isUpdateMode || (this.isUpdateMode && this.interventionOrderToUpdate.Status === this.interventionStateEnumerator.Open)) {
          // Add items to the InterventionItems list
          this.listItemFromOperationKit.forEach((x) => {
            const interventionItem = this.createInterventionItemFromItem(x);
            const index = this.interventionItemList.findIndex(y => y.IdItem === interventionItem.IdItem);
            if (index < 0) {
              this.interventionItemList.unshift(interventionItem);
              this.interventionItemList = this.interventionItemList.slice();
            }
          });
        }
      });
    }
  }

  private createInterventionOperationFromOperation(dataItem): InterventionOperation {
    const interventionOperation = new Object() as InterventionOperation;
    interventionOperation.Id = 0;
    interventionOperation.IdIntervention = this.id;
    interventionOperation.IdOperation = dataItem.Id;
    interventionOperation.IdOperationNavigation = dataItem;
    interventionOperation.Ttcprice = dataItem.Ttcprice;
    interventionOperation.Duration = dataItem.ExpectedDuration;
    interventionOperation.Status = this.operationStatusEnumerator.New;
    if (!this.id) {
      interventionOperation.ValidateBy = this.operationValidateByEnumerator.ValidateByUser;
    } else {
      interventionOperation.ValidateBy = this.operationValidateByEnumerator.ValidateByPhone;
    }
    return interventionOperation;
  }

  private createInterventionItemFromItem(dataItem): InterventionItem {
    const interventionItem = new Object() as InterventionItem;
    interventionItem.IdItemNavigation = new Item();
    interventionItem.IdItemNavigation.Description = dataItem.Description;
    interventionItem.IdItemNavigation.Code = dataItem.Code;
    interventionItem.Id = 0;
    interventionItem.IdItem = dataItem.Id;
    interventionItem.IdIntervention = this.id;
    interventionItem.UnitHtsalePrice = dataItem.UnitHtsalePrice;
    interventionItem.Quantity = dataItem.OrderedQuantity;
    interventionItem.Htprice = dataItem.Htprice;
    interventionItem.RemainingQuantity = dataItem.RemainingQuantity;
    return interventionItem;
  }

  sendSmsIntervention() {
    const title = GarageConstant.SEND_SMS;
    const data = { selectedTiers: this.interventionOrderToUpdate.IdReceptionNavigation.IdVehicleNavigation.IdTiersNavigation,
    isModal: true };
    this.formModalDialogService.openDialog(title, SendReminderSmsComponent,
      this.viewRef, null, data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  goBackToList() {
    this.router.navigateByUrl(GarageConstant.NAVIGATE_TO_INTERVENTION_ORDER_LIST);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.addInterventionFormGroup.dirty);
  }

  get IdGarage(): FormControl {
    return this.addInterventionFormGroup.get(GarageConstant.ID_GARAGE) as FormControl;
  }
  get InterventionType(): FormControl {
    return this.addInterventionFormGroup.get(GarageConstant.INTERVENTION_TYPE) as FormControl;
  }
  get InterventionFor(): FormControl {
    return this.addInterventionFormGroup.get(GarageConstant.INTERVENTION_FOR) as FormControl;
  }
  get IdMileageProgrammed(): FormControl {
    return this.addInterventionFormGroup.get(GarageConstant.ID_MILEAGE_PROGRAMMED) as FormControl;
  }

  get InterventionDate(): FormControl {
    return this.addInterventionFormGroup.get(GarageConstant.INTERVENTION_DATE) as FormControl;
  }
  get InterventionHours(): FormControl {
    return this.addInterventionFormGroup.get(GarageConstant.INTERVENTION_HOURS) as FormControl;
  }
  get ExpectedDeliveryDate(): FormControl {
    return this.addInterventionFormGroup.get(GarageConstant.EXPECTED_DELIVERY_DATE) as FormControl;
  }
  get ExpectedDeliveryHours(): FormControl {
    return this.addInterventionFormGroup.get(GarageConstant.EXPECTED_DELIVERY_HOURS) as FormControl;
  }
  get IdVehicle(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.ID_VEHICLE) as FormControl;
  }
  get ReceiptDate(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.RECEIPT_DATE) as FormControl;
  }
  get ReceiptHours(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.RECEIPT_HOURS) as FormControl;
  }
  get CurrentMileage(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.CURRENT_MILEAGE) as FormControl;
  }
  get IdWorker(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.ID_WORKER) as FormControl;
  }
  get FuelLevel(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.FUEL_LEVEL) as FormControl;
  }
  get Note(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.NOTE) as FormControl;
  }
  get CigaretteLigher(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.CIGARETTE_LIGHER) as FormControl;
  }
  get CrickTools(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.CRICK_TOOLS) as FormControl;
  }
  get SpareWheel(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.SPARE_WHEEL) as FormControl;
  }
  get Radio(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.RADIO) as FormControl;
  }
  get HandTools(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.HAND_TOOLS) as FormControl;
  }
  get HubCap(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.HUB_CAP) as FormControl;
  }
  get ListOperationKit(): FormControl {
    return this.addReceptionFormGroup.get(GarageConstant.LIST_OPERATION_KIT) as FormControl;
  }
  get LoanVehicle(): FormControl {
    return this.addReceptionFormGroup.get('LoanVehicle') as FormControl;
  }
  operationsChangedValue($event) {
    this.isChanged = $event;
  }
}
