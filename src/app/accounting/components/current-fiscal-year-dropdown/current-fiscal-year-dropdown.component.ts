import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {AccountsConstant} from '../../../constant/accounting/account.constant';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import swal from "sweetalert2";
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {AccountingConfigurationService} from '../../services/configuration/accounting-configuration.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';
import {FiscalYearService} from '../../services/fiscal-year/fiscal-year.service';
import {Router} from '@angular/router';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-current-fiscal-year-dropdown',
  templateUrl: './current-fiscal-year-dropdown.component.html',
  styleUrls: ['./current-fiscal-year-dropdown.component.scss']
})
export class CurrentFiscalYearDropdownComponent implements OnInit, DoCheck {
  public lastUnConcludedFiscalYear: string;
  showFiscalYearDropDown: boolean;
  @Input() fiscalYears: any;
  public lastValidValue: number;
  public selectedValue: any;
  public formatDate =  this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() currentFiscalYearId: any;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(private accountingConfigurationService: AccountingConfigurationService,
              private translate: TranslateService, private growlService: GrowlService,
              private swalWarrings: SwalWarring, private router: Router,
              private fiscalYearService: FiscalYearService,
              public authService: AuthService) { }

  ngOnInit() {
    if(!this.fiscalYears){
      this.loadAllFiscalYears();
    }
    if (this.currentFiscalYearId) {
      this.selectedValue = this.currentFiscalYearId;
      this.lastValidValue = this.currentFiscalYearId;
    }
    this.initLastUnConcludedFiscalYear();
  }
  changeCurrentFiscalYear(id) {

    this.swalWarrings.CreateSwal(this.translate.instant(AccountsConstant.ARE_YOU_SURE_TO_CHANGE_FISCAL_YEAR),
      this.translate.instant(AccountsConstant.ARE_YOU_SURE), this.translate.instant(AccountsConstant.VALIDATION_CONFIRM),
      this.translate.instant(AccountsConstant.CANCEL)).then((result) => {
      if (result.value) {

        this.accountingConfigurationService.getJavaGenericService().getEntityById(id, AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_CONFIGURATION)
          .subscribe(() => {
            this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
            window.location.reload();
          });

      } else if (result.dismiss === swal.DismissReason.cancel) {
        this.selectedValue = this.lastValidValue;
      }
    });

  }
  loadAllFiscalYears() {
    this.fiscalYearService.getJavaGenericService()
      .getData(FiscalYearConstant.FIND_ALL_METHOD_URL).subscribe(fiscalYears => this.fiscalYears = fiscalYears);
  }
  initLastUnConcludedFiscalYear() {
    this.fiscalYearService.getJavaGenericService().getEntityList(FiscalYearConstant.FIRST_FISCAL_YEAR_NOT_CONCLUDED)
      .subscribe((fiscalYear) => {
        if (fiscalYear.id) {
          this.lastUnConcludedFiscalYear = fiscalYear.name;
        } else {
          this.lastUnConcludedFiscalYear = undefined;
        }
      });
  }
  ngDoCheck() {
    if (this.router.url.indexOf(SharedAccountingConstant.ACCOUNTING_REPORTING_STATE_OF_INCOME_URL) > 0 ||
      this.router.url.indexOf(SharedAccountingConstant.ACCOUNTING_REPORTING_BALANCE_SHEET_URL) > 0 ||
      this.router.url.indexOf(SharedAccountingConstant.ACCOUNTING_REPORTING_INTERMEDIARY_BALANCE_SHEET_URL) > 0) {
      this.showFiscalYearDropDown = false;
    } else {
      this.showFiscalYearDropDown = true;
    }
  }
}
