import {Component, OnInit} from '@angular/core';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {State} from '@progress/kendo-data-query';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {UserService} from '../../../administration/services/user/user.service';
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {HistoryService} from '../../services/history/history.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DocumentAccountLine} from '../../../models/accounting/document-account-line';
import {NumberFormatOptions} from '@progress/kendo-angular-intl';
import {HistoryConstant} from '../../../constant/accounting/historic.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {Sort} from '../../../models/accounting/Sort';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import {DocumentAccountConstant} from '../../../constant/accounting/document-account.constant';

@Component({
  selector: 'app-document-aacount-history',
  templateUrl: './document-account-history.component.html',
  styleUrls: ['./document-account-history.component.scss']
})
export class DocumentAccountHistoryComponent implements OnInit {

  private pageSize = NumberConstant.TEN;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public formatDateTime = this.translate.instant(SharedConstant.DATE_FORMAT);
  private entityActions = [];
  public searchValue = '';
  public startDate: Date;
  public endDate: Date;
  public startTime: Date;
  public endTime: Date;
  public historySearchFields: any;
  public selectedSearchType: any;
  public selectedField: any;
  public isSearchType = false;
  public documentAccountId;
  public accountList = [];
  public lineIsCheck = false;
  public formatNumberOptions: NumberFormatOptions;
  public currency: any = this.activatedRoute.snapshot.data['currency'];
  public documentAccountListUrl = DocumentAccountConstant.LIST_DOCUMENT_ACCOUNT_URL;
  // public searchByField = HistoryConstant.SEARCH_HISTORIC_BY_ATTRIBUT;
  public searchType = [HistoryConstant.SEARCH_HISTORIC_BY_ATTRIBUT, HistoryConstant.SEARCH_HISTORIC_BY_ACTION_TYPE];
  public searchByAction: any = [HistoryConstant.SEARCH_HISTORIC_BY_ACTION_INSERTED, HistoryConstant.SEARCH_HISTORIC_BY_ACTION_UPDATED,
    HistoryConstant.SEARCH_HISTORIC_BY_ACTION_DELETED];

  private createdByIds: any;
  private sort = new Sort('id', 'DESC');
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
      field: HistoryConstant.OPERATION_TYPE_FIELD,
      title: HistoryConstant.OPERATION_TYPE_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.CONCERNED_ELEMENT_FIELD,
      title: HistoryConstant.CONCERNED_ELEMENT_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.OLD_VALUE_FIELD,
      title: HistoryConstant.OLD_VALUE_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.NEW_VALUE_FIELD,
      title: HistoryConstant.NEW_VALUE_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.ENTITY_NAME_FIELD,
      title: HistoryConstant.ENTITY_NAME_COLUMN,
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
              private genericAccountingService: GenericAccountingService, private translateService: TranslateService,
              private activatedRoute: ActivatedRoute, private translate: TranslateService, private styleConfigService: StyleConfigService,
    private router: Router)
  {
    this.setFormatNumberOptions();
  }

  ngOnInit() {
    this.documentAccountId = this.activatedRoute.snapshot.params.id;
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
    this.initGridDataSourceDocumentAccount(page);
  }

  private checkFilterByDate(searchDate: Date, time: Date, type: string) {
    if (!this.genericAccountingService.isNullAndUndefinedAndEmpty(searchDate) &&
      this.genericAccountingService.isNullAndUndefinedAndEmpty(time)) {
      return this.datePipe.transform(searchDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS_FORMAT);
    } else if (this.genericAccountingService.isNullAndUndefinedAndEmpty(searchDate) &&
      !this.genericAccountingService.isNullAndUndefinedAndEmpty(time)) {
      searchDate = this.resetDate(type, searchDate);
      return this.datePipe.transform(searchDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS_FORMAT);
    } else if (!this.genericAccountingService.isNullAndUndefinedAndEmpty(searchDate) &&
      !this.genericAccountingService.isNullAndUndefinedAndEmpty(time)) {
      const dateTime = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate(),
        time.getUTCHours() + 1, time.getUTCMinutes(), time.getUTCSeconds());
      return this.datePipe.transform(dateTime, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS_FORMAT);
    } else {
      return '';
    }
  }

  private checkEntityFieldType(data) {
    data.historicDtoList.map(historic => {
      this.entityActions.push(historic.action);
    });
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

  onSearch() {
    if (this.endDate && this.startDate && this.endDate < this.startDate) {
      this.endDate = this.startDate;
    }
    this.initHistoryData();
  }

  /*init search dropDown field */
  private initHistoricSearchFields() {
    this.historySearchFields = [];
    this.initDocumentAccountingSearchFields();
  }

  /*init action dropDown field*/
  private initHistoricSearchByType() {
    this.historySearchFields = [];
    this.historySearchFields = this.searchByAction.map(value => {
      return value = {key: value, value: this.translateService.instant(value)};
    });
  }

  /*on change field or action search value*/
  onChangeSearchField(key) {
    if (!this.genericAccountingService.isNullAndUndefinedAndEmpty(key)) {
      this.searchValue = key;
    } else {
      this.searchValue = '';
      this.selectedField = '';
    }
    this.initHistoryData();
  }

  /*on change type Filtre value*/
  onChangeSearchByType(searchType) {
    if (searchType === HistoryConstant.SEARCH_HISTORIC_BY_ATTRIBUT) {
      this.resetAndInitSearchFieldValues();
      this.initHistoricSearchFields();
    } else if (searchType === HistoryConstant.SEARCH_HISTORIC_BY_ACTION_TYPE) {
      this.resetAndInitSearchFieldValues();
      this.initHistoricSearchByType();
    } else {
      this.resetDropdownFields();
      this.initHistoryData();
    }
  }

  private resetAndInitSearchFieldValues() {
    this.selectedField = '';
    this.isSearchType = true;
  }

  private resetDropdownFields() {
    this.historySearchFields = [];
    this.selectedSearchType = '';
    this.selectedField = '';
    this.isSearchType = false;
    this.searchValue = '';
  }


  /*reset startDate or endDate to date of now*/
  private resetDate(type, searchDate) {
    if (type === HistoryConstant.START_DATE && this.genericAccountingService.isNullAndUndefinedAndEmpty(searchDate)) {
      return this.startDate = new Date();
    } else if (type === HistoryConstant.END_DATE && this.genericAccountingService.isNullAndUndefinedAndEmpty(searchDate)) {
      return this.endDate = new Date();
    }
  }


  public onSortChange(event) {
    if (event[0]) {
      const selectedSort = event[0];
      if (selectedSort.dir) {
        if (selectedSort.field === HistoryConstant.CONCERNED_ELEMENT_FIELD || selectedSort.field === HistoryConstant.CURRENT_USER_FIELD) {
          this.gridSettings.gridData.data =
            this.genericAccountingService.sortListByColumnAndOrder(this.gridSettings.gridData.data, selectedSort.dir, selectedSort.field);
        } else {
          this.sort = new Sort(selectedSort.field, ''.concat(selectedSort.dir).toUpperCase());
          this.initHistoryData();
        }
      }
    }
  }


  /** get history data  */
  initHistoryData() {
    this.initGridDataSourceDocumentAccount(NumberConstant.ZERO);
  }

  /** map historySearchFields */
  mapHistorySearchFields(historicSearchFields): any {
    return historicSearchFields.map((field: any) => {
      return field = {key: field.key, value: this.translateService.instant(field.value)};
    });
  }


  /**
   * Documet Account historique
   */

  initGridDataSourceDocumentAccount(page: number) {
    if (this.lineIsCheck) {
      const startDate = this.checkFilterByDate(this.startDate, this.startTime, HistoryConstant.START_DATE);
      const endDate = this.checkFilterByDate(this.endDate, this.endTime, HistoryConstant.END_DATE);
      this.historyService.getJavaGenericService().getData(`historic-by-document-account-id` +
        '?entityId=' + this.documentAccountId + '&searchValue=' + this.searchValue + '&startDate=' + startDate + '&endDate=' +
        endDate + '&page=' + page + '&size=' + NumberConstant.TEN + '&field=' + this.sort.field + '&direction=' + this.sort.direction
      ).subscribe(
        (data) => {
          if (data) {
            this.checkEntityFieldType(data);
            this.initHistoricData(data);
          }
        });
    } else {
      this.historyService.getJavaGenericService().getData(`historic-line-by-document-account-id` +
        '?entityId=' + this.documentAccountId + '&page=' + page + '&size=' + NumberConstant.TEN
      ).subscribe(
        (data) => {
          if (data) {
            this.checkEntityFieldType(data);
            this.initHistoricData(data);
          }
        });
    }
  }

  /*init dropdown by claim search fields*/
  private initDocumentAccountingSearchFields() {
    this.historyService.getJavaGenericService().getData('historic-document-account-search-fields')
      .subscribe(historicSearchFields => {
        this.historySearchFields = this.mapHistorySearchFields(historicSearchFields);
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

  checkLine(dataItem: any, index?: number): boolean {
    return (dataItem.action === 'UPDATED' && dataItem.entity !== 'DOCUMENT_ACCOUNT_LINE') || dataItem.historicList.length > 0 ||
      dataItem.entity === 'DOCUMENT_ACCOUNT_LINE';
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

  getSwitchValue(e) {
    this.lineIsCheck = e;
    this.initGridDataSourceDocumentAccount(NumberConstant.ZERO);
  }
  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  public goToList() {
    this.router.navigateByUrl(this.documentAccountListUrl);
  }
}
