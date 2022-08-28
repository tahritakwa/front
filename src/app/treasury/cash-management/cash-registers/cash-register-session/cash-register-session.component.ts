import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, DataSourceRequestState } from '@progress/kendo-data-query';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { CashRegisterConstant } from '../../../../constant/treasury/cash-register.constant';
import { SessionCashConstant } from '../../../../constant/treasury/session-cash.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { Currency } from '../../../../models/administration/currency.model';
import { CashRegisterItemTypeEnumerator, CashRegisterStatusEnumerator } from '../../../../models/enumerators/cash-managment-hierarchy-test-data.enum';
import { CashRegister } from '../../../../models/treasury/cash-register.model';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FileService } from '../../../../shared/services/file/file-service.service';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { SessionCashService } from '../../../services/session-cash/session-cash.service';
import { TicketService } from '../../../services/ticket/ticket.service';
import { CashRegisterTicketComponent } from '../cash-register-ticket/cash-register-ticket.component';
import { OpenCashRegisterSessionComponent } from '../open-cash-register-session/open-cash-register-session.component';

@Component({
  selector: 'app-cash-register-session',
  templateUrl: './cash-register-session.component.html',
  styleUrls: ['./cash-register-session.component.scss']
})
export class CashRegisterSessionComponent implements OnInit, OnChanges {

  @Input() selectedcashRegister: CashRegister;

  public columnsConfig: ColumnSettings[] = [
    {
      field: SessionCashConstant.SESSION_TO_CENTRAL_CASH_REGISTER,
      title: SessionCashConstant.PRINCIPAL,
      filterable: true,
      _width: 100
    },
    {
      field: SessionCashConstant.SESSION_TO_CASH_REGISTER,
      title: SessionCashConstant.CASH_REGISTER_NAME,
      filterable: true,
      _width: 100
    },
    {
      field: SessionCashConstant.CASHIER,
      title: SessionCashConstant.CASHIER_NAME,
      filterable: true,
      _width: 100
    },
    {
      field: SessionCashConstant.CODE,
      title: SessionCashConstant.CODE_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: SessionCashConstant.OPENING_DATE,
      title: SessionCashConstant.OPENING_DATE_TITLE,
      format: this.translate.instant("DATE_AND_TIME_FORMAT"),
      filterable: true,
      _width: 150
    },
    {
      field: SessionCashConstant.CLOSING_DATE,
      title: SessionCashConstant.CLOSING_DATE_TITLE,
      format: this.translate.instant("DATE_AND_TIME_FORMAT"),
      filterable: true,
      _width: 150
    },
    {
      field: SessionCashConstant.STATE,
      title: SessionCashConstant.STATE_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: SessionCashConstant.OPENING_AMOUNT,
      title: SessionCashConstant.OPENING_AMOUNT_TITLE,
      filterable: true,
      _width: 200
    },
    {
      field: SessionCashConstant.CLOSING_AMOUNT,
      title: SessionCashConstant.CLOSING_AMOUNT_TITLE,
      filterable: true,
      _width: 200
    },
    {
      field: SessionCashConstant.CLOSING_AMOUNT,
      title: SessionCashConstant.GAP,
      filterable: true,
      _width: 200
    }
  ];

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /* Grid state
 */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  language: string;
  public companyCurrency: Currency;
  // Enumerators
  public cashRegisterStatus = CashRegisterStatusEnumerator;
  cashRegisterItemTypeEnumerator = CashRegisterItemTypeEnumerator;
  // permissions
  public haseOpenSessionCashPermission: boolean;

  constructor(private sessionCashService: SessionCashService, private modalDialogService: FormModalDialogService,
    private viewContainerRef: ViewContainerRef, private translate: TranslateService, private companyService: CompanyService,
    private authService: AuthService, private localStorageService: LocalStorageService, private serviceTicket: TicketService, 
    private fileService: FileService) { }

  ngOnInit() {
    this.language = this.localStorageService.getLanguage();
    this.haseOpenSessionCashPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.OPEN_SESSION_CASH);
    this.companyService.getCurrentCompany().subscribe(data => {
      this.companyCurrency = data.IdCurrencyNavigation;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedcashRegister.currentValue) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.gridSettings.state.take = NumberConstant.TWENTY;
      this.initGridDataSource();
    }
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public initGridDataSource() {
    if (this.selectedcashRegister) {
      this.sessionCashService.getCashRegisterSessionDetails(this.gridSettings.state, this.selectedcashRegister.Id)
        .subscribe(data => {
          this.gridSettings.gridData = new Object() as DataResult;
          this.gridSettings.gridData.data = data.listData;
          this.gridSettings.gridData.total = data.total;
        });
    }

  }

  addSessionCash() {
    this.modalDialogService.openDialog(CashRegisterConstant.OPEN_CASH_REGISTER, OpenCashRegisterSessionComponent,
      this.viewContainerRef, this.initGridDataSource.bind(this), null, false, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  showSessionHistory(dataItem) {
    const data = {};
    data['openedSession'] = dataItem;
    this.modalDialogService.openDialog(null, CashRegisterTicketComponent,
      this.viewContainerRef, null, data, false, SharedConstant.MODAL_DIALOG_SIZE_L);
  }


}
