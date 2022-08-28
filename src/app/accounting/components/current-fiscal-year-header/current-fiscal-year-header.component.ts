import { ChangeDetectorRef, Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { AccountingConfigurationConstant } from '../../../constant/accounting/accounting-configuration.constant';
import { AccountingConfigurationService } from '../../services/configuration/accounting-configuration.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FiscalYearService } from '../../services/fiscal-year/fiscal-year.service';
import { FiscalYearConstant } from '../../../constant/accounting/fiscal-year.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {GenericAccountingService} from '../../services/generic-accounting.service';

@Component({
  selector: 'app-current-fiscal-year-header',
  templateUrl: './current-fiscal-year-header.component.html',
  styleUrls: ['./current-fiscal-year-header.component.scss']
})
export class CurrentFiscalYearHeaderComponent implements OnInit, DoCheck {
  public lastUnConcludedFiscalYear: string;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public selectedValue: any;
  @Input() fiscalYears: any;
  public lastValidValue: number;
  @Input() showHeaderClass = true;
  @Input() currentFiscalYearId: any;
  showFiscalYearDropDown: boolean;
  /**
   *@param accountingConfigurationService
   * @param fiscalYearService
   * @param swalWarrings
   * @param translateService
   * @param growlService
   * @param router
   * @param translate
   * @param cdr
   */
  constructor(private accountingConfigurationService: AccountingConfigurationService,
    private fiscalYearService: FiscalYearService,
    private swalWarrings: SwalWarring,
    private translateService: TranslateService,
    private growlService: GrowlService,
    private router: Router,
    private starkRolesService: StarkRolesService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
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

  loadAllFiscalYears() {
    this.fiscalYearService.getJavaGenericService()
      .getData(FiscalYearConstant.FIND_ALL_METHOD_URL).subscribe(fiscalYears => this.fiscalYears = fiscalYears);
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
}
