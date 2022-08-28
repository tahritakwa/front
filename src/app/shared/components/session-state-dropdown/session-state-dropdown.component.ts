import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { CnssDeclarationConstant } from '../../../constant/payroll/cnss-declaration.constant';
import { LoanConstant } from '../../../constant/payroll/loan.constant';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';

@Component({
  selector: 'app-session-state-dropdown',
  templateUrl: './session-state-dropdown.component.html',
  styleUrls: ['./session-state-dropdown.component.scss']
})
export class SessionStateDropdownComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() stateList: string
  public stateListData: Array<any>;
  public payrollSessionState = PayrollSessionState;
  @Output() selectedValue = new EventEmitter<any>();
  @ViewChild(ComboBoxComponent) sessionStateComboBoxComponent: ComboBoxComponent;

  public sessionStateFilter: Array<any> = [
    {
      id: this.payrollSessionState.Attendance,
      name: this.translate.instant(SessionConstant.ATTENDANCE)
    },
    {
      id: this.payrollSessionState.Bonus,
      name: this.translate.instant(SessionConstant.BONUS)
    },
    {
      id: this.payrollSessionState.Loan,
      name: this.translate.instant(SessionConstant.LOAN)
    },
    {
      id: this.payrollSessionState.Payslip,
      name: this.translate.instant(SessionConstant.PAYSLIP)
    },
    {
      id: this.payrollSessionState.Closed,
      name: this.translate.instant(SessionConstant.CLOSED)
    }
  ];

  public transferOrderStateFilter: Array<any> = [

    { id: true, name: this.translate.instant(CnssDeclarationConstant.OPEN) },
    { id: false, name: this.translate.instant(CnssDeclarationConstant.CLOSED) }
  ];

  public loanStateFilter: Array<any> = [
    { id: AdministrativeDocumentStatusEnumerator.AllStatus, name: this.translate.instant(LoanConstant.ALL) },
    { id: AdministrativeDocumentStatusEnumerator.Waiting, name: this.translate.instant(LoanConstant.WAITING) },
    { id: AdministrativeDocumentStatusEnumerator.Accepted, name: this.translate.instant(LoanConstant.ACCEPTED) },
    { id: AdministrativeDocumentStatusEnumerator.Refused, name: this.translate.instant(LoanConstant.REFUSED) }
  ];

  constructor(public translate: TranslateService) { }

  ngOnInit() {
    if ( this.stateList && this.stateList === FieldTypeConstant.sessionStateComponent) {
      this.stateListData = this.sessionStateFilter;
    } else if ( this.stateList && this.stateList === FieldTypeConstant.transferOderStateComponent){
      this.stateListData = this.transferOrderStateFilter;
    } else if ( this.stateList && this.stateList === FieldTypeConstant.loanStateComponent){
      this.stateListData = this.loanStateFilter;
    }
  }

  public onStatusFilterChanged($event: any) {
    this.selectedValue.emit($event.id);
  }
}
