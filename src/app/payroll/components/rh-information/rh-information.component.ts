import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExitEmployeeService} from '../../services/exit-employee/exit-employee.service';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import {ContractType} from '../../../models/payroll/contract-type.model';
import {ContractInformationsComponent} from '../contract-informations/contract-informations.component';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {AdministrativeDocumentStatusEnumerator} from '../../../models/enumerators/administrative-document-status.enum';
import {ExitEmployee} from '../../../models/payroll/exit-employee.model';
import {dateValueGT} from '../../../shared/services/validation/validation.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-rh-information',
  templateUrl: './rh-information.component.html',
  styleUrls: ['./rh-information.component.scss']
})
export class RhInformationComponent implements OnInit {
  @Input() employeeExit: ExitEmployee;
  LeaveEmployeeRhFormGroup: FormGroup;
  public isUpdateMode = true;
  public listCurrentSelectedIds: number[] = [];
  contractType: ContractType;
  public emptyContractType = true;
  public statusCode = AdministrativeDocumentStatusEnumerator;

  constructor(private fb: FormBuilder, public exitEmployeeService: ExitEmployeeService,
              private formModalDialogService: FormModalDialogService
    , private viewRef: ViewContainerRef) {
  }

  get LegalExitDate(): FormControl {
    return this.LeaveEmployeeRhFormGroup.get(ExitEmployeeConstant.LEGAL_EXIT_DATE) as FormControl;
  }

  get ExitPhysicalDate(): FormControl {
    return this.LeaveEmployeeRhFormGroup.get(ExitEmployeeConstant.PHYSICAL_EXIT_DATE) as FormControl;
  }

  get MinNoticePeriodDate(): FormControl {
    return this.LeaveEmployeeRhFormGroup.get(ExitEmployeeConstant.MIN_NOTICE_PERIOD_DATE) as FormControl;
  }

  get MaxNoticePeriodDate(): FormControl {
    return this.LeaveEmployeeRhFormGroup.get(ExitEmployeeConstant.MAX_NOTICE_PERIOD_DATE) as FormControl;
  }

  ngOnInit() {
    this.createLeaveEmployeeFormGroup(this.employeeExit);
    if (this.isUpdateMode && this.employeeExit) {
      if (this.employeeExit.ExitEmailForEmployee) {
        this.employeeExit.ExitEmailForEmployee.forEach((x) => {
          this.listCurrentSelectedIds.push(x.IdEmployee);
        });
        this.GetContractType();
        this.LeaveEmployeeRhFormGroup.patchValue(this.employeeExit);
        if (this.employeeExit.Status === this.statusCode.Refused || this.employeeExit.Status === this.statusCode.Accepted) {
          this.LeaveEmployeeRhFormGroup.disable();
        }
      }
    }
  }

  public GetContractType() {
    if (this.employeeExit && this.employeeExit.Contract) {
      this.contractType = this.employeeExit.Contract.IdContractTypeNavigation;
      this.emptyContractType = false;
    }
  }

  public OpenContractDetailsModal() {
    this.formModalDialogService.openDialog(ExitEmployeeConstant.DEATILS,
      ContractInformationsComponent, this.viewRef, null,
      this.employeeExit.Contract, true, SharedConstant.MODAL_DIALOG_SIZE_S);
  }

  public GetLeaveEmployeeRhFormGroup() {
    return this.LeaveEmployeeRhFormGroup;
  }

  public selectEmployeeExitEmployee($event) {
    this.listCurrentSelectedIds = $event.selectedValueMultiSelect;
  }

  public GetListCurrentSelectedIds() {
    return this.listCurrentSelectedIds;
  }

  private createLeaveEmployeeFormGroup(employeeExit?: ExitEmployee): void {
    this.LeaveEmployeeRhFormGroup = this.fb.group({
      LegalExitDate: [employeeExit && employeeExit.LegalExitDate ? new Date(employeeExit.LegalExitDate) : undefined],
      DamagingDeparture: [employeeExit ? employeeExit.DamagingDeparture : false],
      ExitPhysicalDate: [employeeExit && employeeExit.ExitPhysicalDate ? new Date(employeeExit.ExitPhysicalDate) : undefined],
      MinNoticePeriodDate: [employeeExit && employeeExit.MinNoticePeriodDate ? new Date(employeeExit.MinNoticePeriodDate) : undefined],
      MaxNoticePeriodDate: [employeeExit && employeeExit.MaxNoticePeriodDate ? new Date(employeeExit.MaxNoticePeriodDate) : undefined],
    });
    this.addDependentDateControls();
  }

  private addDependentDateControls() {
    this.ExitPhysicalDate.setValidators([dateValueGT(new Observable(o => o.next(this.employeeExit.IdEmployeeNavigation.HiringDate)))]);
  }
}

