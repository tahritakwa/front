import {Component, OnInit, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import { EnumValues } from 'enum-values';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { TimeSheetStatusEnumerator } from '../../../models/enumerators/timeSheet-status-enumerator.enum';
import {ActiveTeamEnumerator} from '../../../models/enumerators/active-team.enum';
import {PayslipStatus} from '../../../models/enumerators/payslip-status.enum';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { ContractStateEnumerator } from '../../../models/enumerators/contractStateEnumerator.model';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { BillingSessionState } from '../../../models/enumerators/BillingSessionState.enum';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-status-dropdown',
  templateUrl: './status-dropdown.component.html',
  styleUrls: ['./status-dropdown.component.scss']
})
export class StatusDropdownComponent implements OnInit {
  @Input() statusList;
  @Input() form: FormGroup;
  @Input() timeSheetEnum;
  @Input() activeTeamEnum;
  @Output() selectedValue = new EventEmitter<any>();
  @Input() withNotCancelStatus;
  @Input() isPayslip;
  @Input() isContract: boolean;
  @Input() isCnssDeclaration;
  @Input() isBillingSession;
  @ViewChild(ComboBoxComponent) public status: ComboBoxComponent;
  public statusDataSource: any;
  public name;
  public administrationDocumentStatusEnumValues = EnumValues.getNamesAndValues(AdministrativeDocumentStatusEnumerator);
  public TimeSheetStatusEnumValues = EnumValues.getNamesAndValues(TimeSheetStatusEnumerator);
  public TeamStatusEnumValues = EnumValues.getNamesAndValues(ActiveTeamEnumerator);
  public PayslipStatusEnumValues = EnumValues.getNamesAndValues(PayslipStatus);
  public ContractStatusEnumValues = EnumValues.getNamesAndValues(ContractStateEnumerator);
  public sessionStatusEnumValues = EnumValues.getNamesAndValues(PayrollSessionState);
  public billingsessionStatusEnumValues = EnumValues.getNamesAndValues(BillingSessionState);
  constructor(public translate: TranslateService) { }
  ngOnInit() {
    if (this.timeSheetEnum) {
      this.initTimeSheetStatusDataSource();
    } else if (this.activeTeamEnum) {
      this.initActiveTeamStatusDataSource();
    } else if (this.isPayslip) {
      this.initPayslipStatusDataSource();
    } else if (this.isContract) {
      this.initContractStatusDataSource();
    } else if(this.isCnssDeclaration){
      this.initCnssDeclarationStatusDataSource();
    } else if (this.isBillingSession){
      this.initBillingSessionStatusDataSource();
    }
    else {
      this.initDataSource();
    }
  }

  initDataSource(): void {
    this.statusDataSource = [];
    if (this.withNotCancelStatus) {
      const canceled = this.administrationDocumentStatusEnumValues.indexOf(this.administrationDocumentStatusEnumValues.
      filter(x => x.name === SharedConstant.CANCELED)[NumberConstant.ZERO]);
      this.administrationDocumentStatusEnumValues.splice(canceled, NumberConstant.ONE);
    }
    this.administrationDocumentStatusEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.statusDataSource.push(elem);
    });
  }

  initTimeSheetStatusDataSource() {
    this.statusDataSource = [];
    this.TimeSheetStatusEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.statusDataSource.push(elem);
    });
  }
  initActiveTeamStatusDataSource() {
    this.statusDataSource = [];
    this.TeamStatusEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.statusDataSource.push(elem);
    });
  }

  initPayslipStatusDataSource() {
    this.statusDataSource = [];
    this.PayslipStatusEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.statusDataSource.push(elem);
    });
  }

  initContractStatusDataSource() {
    this.statusDataSource = [];
    this.ContractStatusEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.statusDataSource.push(elem);
    });
  }

  initCnssDeclarationStatusDataSource(){
    this.statusDataSource = [];
    this.sessionStatusEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.statusDataSource.push(elem);
    });
  }
  initBillingSessionStatusDataSource() {
    this.statusDataSource = [];
    this.billingsessionStatusEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.statusDataSource.push(elem);
    });
  }
  onSelect($event) {
    this.selectedValue.emit($event);
  }

}
