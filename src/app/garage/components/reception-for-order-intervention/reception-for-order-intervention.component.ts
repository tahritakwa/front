import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef, ViewEncapsulation
 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { InterventionLoanVehicleStatusEnumerator } from '../../../models/enumerators/intervention-loan-vehicle-status-.enum';
import { InterventionOrderStateEnumerator } from '../../../models/enumerators/intervention-order-state.enum';
import { InterventionOrderTypeEnumerator } from '../../../models/enumerators/intervention-order-type.enum';
import { Garage } from '../../../models/garage/garage.model';
import { InterventionLoanVehicle } from '../../../models/garage/intervention-loan-vehicle.model';
import { Intervention } from '../../../models/garage/intervention.model';
import { OperationKit } from '../../../models/garage/operation-kit.model';
import { Vehicle } from '../../../models/garage/vehicle.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { MileageService } from '../../services/mileage/mileage.service';
import { AddInterventionLoanVehicleComponent } from '../add-intervention-loan-vehicle/add-intervention-loan-vehicle.component';
import {
  ImageDrawingVehiculeForOrderInterventionPopUpComponent
 } from '../image-drawing-vehicule-for-order-intervention-pop-up/image-drawing-vehicule-for-order-intervention-pop-up.component';
import { OperationKitSelectedComponent } from '../operation-kit-selected/operation-kit-selected.component';
import { OperationsProposedPopUpComponent } from '../operations-proposed-pop-up/operations-proposed-pop-up.component';

@Component({
  selector: 'app-reception-for-order-intervention',
  templateUrl: './reception-for-order-intervention.component.html',
  styleUrls: ['./reception-for-order-intervention.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReceptionForOrderInterventionComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() intervention: Intervention;
  @Input() interventionId: number;
  @Input() selectedVehicle: Vehicle;
  @Input() selectedOperationKit: Array<OperationKit>;
  @Input() isOperationKitDisabled: boolean;
  @Input() hasUpdatePermission: boolean;
  @Output() vehicleDiagnosticImgSrcEmit: EventEmitter<FileInfo> = new EventEmitter<FileInfo>();
  @Output() mileageProposedValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() proposedOperationGridVisibility: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() garageSelectedChange: EventEmitter<Garage> = new EventEmitter<Garage>();
  @Output() operationKitSelectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  vehicleDiagnosticImage: FileInfo;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  vehiculeImgSrc: any;
  showProgrammedInterventionSection: boolean;
  showOperationKitDropdown: boolean;
  interventionLoanVehicle: InterventionLoanVehicle;
  interventionLoanVehicleStatusEnumerator = InterventionLoanVehicleStatusEnumerator;
  interventionOrderStateEnumerator = InterventionOrderStateEnumerator;

  // Mileage value calculated
  mileageValue: any;
  // Type intervention
  interventionType = InterventionOrderTypeEnumerator;
  constructor(private formModalDialogService: FormModalDialogService, public growlService: GrowlService,
    public translate: TranslateService, private viewRef: ViewContainerRef, private mileageService: MileageService) { }

  ngOnInit() {
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['intervention']) {
      this.intialiseInterventionLoanVehicle();
    }
  }

  intialiseInterventionLoanVehicle() {
    if (this.intervention && this.intervention.InterventionLoanVehicle &&
       this.intervention.InterventionLoanVehicle[0]) {
      this.interventionLoanVehicle = this.intervention.InterventionLoanVehicle[0];
    } else {
        this.interventionLoanVehicle = new InterventionLoanVehicle();
        this.interventionLoanVehicle.IdIntervention = this.interventionId;
        this.interventionLoanVehicle.Status = this.interventionLoanVehicleStatusEnumerator.InLoan;
    }
  }

  openImageDrawing() {
    const title = GarageConstant.CAR_BREAK_DOWN;
    this.formModalDialogService.openDialog(title, ImageDrawingVehiculeForOrderInterventionPopUpComponent,
      this.viewRef, this.getImageFromDrawingTools.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  public getImageFromDrawingTools($event) {
    if ($event) {
      const file = $event;
      if (file) {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        this.vehicleDiagnosticImage = new FileInfo();
        this.vehicleDiagnosticImage.Size = file.size;
        this.vehicleDiagnosticImage.Name = 'intervention.png';
        reader.onload = (e: any) => {
          this.vehicleDiagnosticImage.FileData = (<string>reader.result).split(',')[1];
          this.vehicleDiagnosticImgSrcEmit.emit(this.vehicleDiagnosticImage);
        };
      }
    }
  }

  vehicleBrandPictureSrc() {
    if (this.selectedVehicle && this.selectedVehicle.IdVehicleBrandNavigation &&
      this.selectedVehicle.IdVehicleBrandNavigation.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE + this.selectedVehicle.IdVehicleBrandNavigation.PictureFileInfo.Data;
    }
  }

  vehicleDiagnosticPictureSrc() {
    if (this.vehicleDiagnosticImage && (this.vehicleDiagnosticImage.FileData || this.vehicleDiagnosticImage.Data)) {
      return SharedConstant.PICTURE_BASE + (this.vehicleDiagnosticImage.FileData
        ? this.vehicleDiagnosticImage.FileData : this.vehicleDiagnosticImage.Data);
    }
  }

  public setvehicleDiagnosticImage(imgFileInfo: FileInfo) {
    this.vehicleDiagnosticImage = imgFileInfo;
  }

  cleanFuelLevelValue() {
    this.ReceptionFormGroup.controls.FuelLevel.setValue(undefined);
  }

  mileageValueChanged($event) {
    const mileageValue = $event.target.value;
    this.mileageService.GetProposedMileageToDoForCurrentMileage(mileageValue)
      .subscribe(x => {
        if (x) {
          this.form.controls.IdMileageProgrammed.setValue(x.Id);
          this.mileageProposedValue.emit(x.Name);
          this.showProposedOperationGridVisible();
        } else {
          this.proposedOperationGridVisibility.emit(false);
        }
      });
  }

  public onLoanVehicleValueChange($event) {
    if (this.ReceptionFormGroup.controls.LoanVehicle.value) {
      const title = GarageConstant.LOAN_VEHICLE;
      const data = this.interventionLoanVehicle;
      this.formModalDialogService.openDialog(title, AddInterventionLoanVehicleComponent, this.viewRef,
        this.updateInterventionLoanVehicle.bind(this), data, true, SharedConstant.MODAL_DIALOG_CLASS_S);
    } else {
      this.intialiseInterventionLoanVehicle();
    }
  }

  public getLoanVehicleValue() {
    if (this.ReceptionFormGroup.controls.LoanVehicle.value) {
      return this.interventionLoanVehicle;
    } else {
      if (this.intervention && this.intervention.InterventionLoanVehicle && this.intervention.InterventionLoanVehicle[0]) {
        const interventionLoanVehicle = this.intervention.InterventionLoanVehicle[0];
        interventionLoanVehicle.IsDeleted = true;
        return interventionLoanVehicle;
      } else {
        return null;
      }
    }
  }

  public updateInterventionLoanVehicle(data) {
    if (data && data.IdVehicle && data.LoanDate && data.ExpectedReturnDate) {
      // Add Intervention Loan Vehicle entity
      this.interventionLoanVehicle = data;
    } else {
      this.intialiseInterventionLoanVehicle();
      this.ReceptionFormGroup.controls.LoanVehicle.setValue(false);
    }
  }

  public selectedType($event) {
    if ($event === this.interventionType.PlannedIntervention) {
      this.showProgrammedInterventionSection = true;
      this.showOperationKitDropdown = false;
      this.ReceptionFormGroup.controls.ListOperationKit.setValue(undefined);
      this.selectedOperationKit = [];
    } else if ($event === this.interventionType.UnPlannedIntervention) {
      this.showOperationKitDropdown = true;
      this.showProgrammedInterventionSection = false;
      this.form.controls.IdMileageProgrammed.setValue(undefined);
    } else {
      this.showProgrammedInterventionSection = false;
      this.showOperationKitDropdown = false;
      this.ReceptionFormGroup.controls.ListOperationKit.setValue(undefined);
      this.selectedOperationKit = [];
      this.form.controls.IdMileageProgrammed.setValue(undefined);
    }
    this.showProposedOperationGridVisible();
  }

  mileageProposedValueChange($event) {
    const mileageName = $event ? $event.Name : '';
    this.mileageProposedValue.emit(mileageName);
    this.showProposedOperationGridVisible();
  }

  selectedOneOpeartionKitFromCheckbox($event) {
    // Add operation kit only if the garage is selected
    if (this.form.controls.IdGarage.value) {
      this.selectedOperationKit.push($event);
      this.operationKitSelectedChange.emit(true);
    } else {
       // In case of removing the warehouse while there is already selected items
       this.growlService.ErrorNotification(this.translate.instant(
        GarageConstant.WAREHOUSE_MUST_BE_SELECTED_IN_INTERVENTION));
      this.ReceptionFormGroup.controls.ListOperationKit.setValue([]);
    }
  }

  deSelectedOneOpeartionKitFromCheckbox($event) {
    this.selectedOperationKit = this.selectedOperationKit.filter(s => s.Id !== $event.Id);
    this.operationKitSelectedChange.emit(true);
  }

  operationKitMultiSelectAllValueChange($event) {
    if (this.form.controls.IdGarage.value) {
      this.selectedOperationKit = $event;
      const listOperationKitValue = $event.map((value) => { return { 'Id': value.Id, 'Name': value.Name } });
      this.ReceptionFormGroup.controls.ListOperationKit.setValue(listOperationKitValue);
      this.operationKitSelectedChange.emit(true);
    } else {
      this.growlService.ErrorNotification(this.translate.instant(
        GarageConstant.WAREHOUSE_MUST_BE_SELECTED_IN_INTERVENTION));
      this.ReceptionFormGroup.controls.ListOperationKit.setValue([]);
    }
  }

  showProposedOperationGridVisible() {
    const isVisible: boolean = this.showProgrammedInterventionSection && (this.form.controls.IdMileageProgrammed.value > 0);
    this.proposedOperationGridVisibility.emit(isVisible);
  }

  OperationsProposed() {
    const title = GarageConstant.PROPOSED_OPERATIONS;
    const data = this.form.controls.IdMileageProgrammed.value;
    this.formModalDialogService.openDialog(title, OperationsProposedPopUpComponent,
      this.viewRef, null, data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  showOperationKitSelected() {
    const title = GarageConstant.OPERATION_KIT_SELECTED;
    const data = this.selectedOperationKit;
    this.formModalDialogService.openDialog(title, OperationKitSelectedComponent,
      this.viewRef, null, data, true, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }

  receiptDateChange($event) {
    this.form.controls.InterventionDate.updateValueAndValidity();
  }

  garageSelectedChanged($event) {
    this.garageSelectedChange.emit($event);
  }

  getInterventionOperationKit(): any[] {
    const listOperationKit = this.ReceptionFormGroup.controls.ListOperationKit.value;
    return listOperationKit ? listOperationKit.map(x => x.Id) : [];
  }

  get ReceptionFormGroup(): FormGroup {
    return this.form.controls.IdReceptionNavigation as FormGroup;
  }
}
