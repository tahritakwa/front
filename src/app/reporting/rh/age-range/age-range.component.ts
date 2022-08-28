import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { RhReportingConstant } from '../../../constant/reporting/rh-reporting.constant';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ReportingInModalComponent } from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-age-range',
  templateUrl: './age-range.component.html',
  styleUrls: ['./age-range.component.scss']
})
export class AgeRangeComponent implements OnInit {

  rhAgeRangeFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private formModalDialogService: FormModalDialogService,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.rhAgeRangeFormGroup = this.fb.group({
      IdJob: [],
      IdSalaryStructure: [],
      IdGrade: [],
      IdTeam: [],
      Sex: []
    });
  }

  generateAgeRangeReport() {
    const rhAgeRangeAssign =  Object.assign({}, this.rhAgeRangeFormGroup.value);
    const dataToSend = {
      'departementName': '',
      'Team': rhAgeRangeAssign.IdTeam,
      'Gender': rhAgeRangeAssign.Sex,
      'Job': rhAgeRangeAssign.IdJob,
      'Grade': rhAgeRangeAssign.IdGrade,
      'ContractType': rhAgeRangeAssign.IdSalaryStructure,
      'reportName': 'AgeRange' };
    this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewContainerRef, null, dataToSend, null,
      SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  /**
   * Getters
   */
  get IdJob(): FormControl {
    return this.rhAgeRangeFormGroup.get(RhReportingConstant.ID) as FormControl;
  }

  get IdSalaryStructure(): FormControl {
    return this.rhAgeRangeFormGroup.get(RhReportingConstant.ID_SALARY_STRUCTURE) as FormControl;
  }

  get IdTeam(): FormControl {
    return this.rhAgeRangeFormGroup.get(RhReportingConstant.ID_TEAM) as FormControl;
  }

  get IdGrade(): FormControl {
    return this.rhAgeRangeFormGroup.get(RhReportingConstant.ID_GRADE) as FormControl;
  }

  get Sex(): FormControl {
    return this.rhAgeRangeFormGroup.get(RhReportingConstant.SEX) as FormControl;
  }
}
