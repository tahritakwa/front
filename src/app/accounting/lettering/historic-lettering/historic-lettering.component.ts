import {Component, OnInit} from '@angular/core';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberFormatOptions} from '@progress/kendo-angular-intl';
import {HistoryConstant} from '../../../constant/accounting/historic.constant';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {State} from '@progress/kendo-data-query';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {HistoryService} from '../../services/history/history.service';
import {UserService} from '../../../administration/services/user/user.service';
import {DatePipe} from '@angular/common';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DocumentAccountLine} from '../../../models/accounting/document-account-line';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import {LetteringConstant} from '../../../constant/accounting/lettering.constant';

@Component({
  selector: 'app-historic-lettering',
  templateUrl: './historic-lettering.component.html',
  styleUrls: ['./historic-lettering.component.scss']
})
export class HistoricLetteringComponent implements OnInit {

  private pageSize = NumberConstant.TEN;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public formatDateTime = this.translate.instant(SharedConstant.DATE_FORMAT);
  public formatNumberOptions: NumberFormatOptions;
  public currency: any = this.activatedRoute.snapshot.data['currency'];
  private createdByIds: any;
  public accountList = [];
  private accountId;
  public lettringUrl = LetteringConstant.LETTERING_LIST_URL;

  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false, previousNext: true
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: HistoryConstant.OPERATION_DATE_FIELD,
      title: HistoryConstant.OPERATION_DATE_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.CONCERNED_ELEMENT_FIELD,
      title: HistoryConstant.CONCERNED_ELEMENT_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.NEW_VALUE_FIELD,
      title: HistoryConstant.NEW_VALUE_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.CURRENT_USER_FIELD,
      title: HistoryConstant.CURRENT_USER_COLUMN,
      filterable: true
    }
  ];
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  /**
   *
   * @param historyService
   * @param userService
   * @param datePipe
   * @param genericAccountingService
   * @param translateService
   */
  constructor(private historyService: HistoryService, private userService: UserService, private datePipe: DatePipe,
              private genericAccountingService: GenericAccountingService, private translate: TranslateService,
              private activatedRoute: ActivatedRoute, private styleConfigService: StyleConfigService, private router: Router) {
  }

  ngOnInit() {
    this.accountId = this.activatedRoute.snapshot.params.id;
    this.setFormatNumberOptions();
    this.initGridData(this.gridState.skip);
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.initGridData(event.skip / NumberConstant.TEN);
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
  }

  initGridData(page: number) {
    this.initGridDataSourceLettring(page);
  }

  private checkEntityFieldType(data) {
    this.mapDocumentAccountLine(data);
    this.mapHistoricCreatedBy(data);
  }

  private mapDocumentAccountLine(data: any) {
    if (this.accountList.length > 0) {
      data.historicDtoList.filter(historic => this.checkEntityDocumentAccountLine(historic)).map(historic => {
        if (historic.documentAccountLineAffected.length > 0) {
          historic.documentAccountLineAffected = historic.documentAccountLineAffected.map(line => this.fillAccount(line));
        }
      });
    } else {
      this.initAccountFilteredList(data);
    }
  }

  fillAccount(line) {
    const documentAccountLine = new DocumentAccountLine(line.id, line.documentLineDate, line.reference, line.label,
      line.debitAmount, line.creditAmount, line.accountId, '', '', line.close, line.letter, line.reconciliationDate);
    documentAccountLine.nameAccount = this.accountList.find(accountElement => accountElement.id === line.accountId).label;
    documentAccountLine.codeAccount = this.accountList.find(accountElement => accountElement.id === line.accountId).code;
    documentAccountLine.documentLineDate = new Date(documentAccountLine.documentLineDate);
    return documentAccountLine;
  }

  private initHistoricData(data: any) {
    this.gridSettings.gridData = {
      data: data.historicDtoList,
      total: data.totalElements
    };
  }

  /**
   * Lettring historic
   */

  initGridDataSourceLettring(page: number) {
    this.historyService.getJavaGenericService().getData(`historic-lettring` +
      '?accountId=' + this.accountId + '&page=' + page + '&size=' + NumberConstant.TEN
    ).subscribe(
      (data) => {
        if (data) {
          this.checkEntityFieldType(data);
          this.initHistoricData(data);
        }
      });
  }

  private mapHistoricCreatedBy(data: any) {
    this.createdByIds = data.historicDtoList.map(historic => {
      return historic.createdBy;
    });
    // dintinct array of employees ids values
    this.createdByIds = Array.from(new Set(this.createdByIds));
    this.userService.getUsersListByArray(this.createdByIds).subscribe(employees => {
      data.historicDtoList.map(historic => {
        return historic.createdByFullName = employees.find(employee => Number(employee.Id) === Number(historic.createdBy));
      });
    });
  }

  checkEntityDocumentAccountLine(dataItem: any, index?: number): boolean {
    return dataItem.entity === 'DOCUMENT_ACCOUNT_LINE';
  }

  initAccountFilteredList(data) {
    this.genericAccountingService.getAccountList().then((accountList: any) => {
      this.accountList = accountList;
      this.mapDocumentAccountLine(data);
    });
  }

  private setFormatNumberOptions() {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: this.currency.Precision,
      minimumFractionDigits: this.currency.Precision
    };
  }
  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  public goToList() {
    this.router.navigateByUrl(this.lettringUrl);
  }
}
